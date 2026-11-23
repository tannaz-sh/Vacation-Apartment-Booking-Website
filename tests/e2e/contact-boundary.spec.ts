import { test, expect } from '@playwright/test';

const origin = 'http://127.0.0.1:3000';
const message = {
  name: 'Test Guest', email: 'guest@example.test',
  message: 'This is an isolated development test.', privacy: true, website: '',
};

test('contact rejects lookalike media types', async ({ request }) => {
  for (const contentType of ['application/jsonp', 'application/json-invalid', 'text/plain']) {
    const response = await request.post('/api/kontakt', {
      headers: { origin, 'content-type': contentType }, data: JSON.stringify(message),
    });
    expect(response.status(), contentType).toBe(415);
  }
});

test('contact rejects invalid UTF-8 instead of silently changing a message', async ({ request }) => {
  const body = Buffer.concat([
    Buffer.from('{"name":"Test '), Buffer.from([0xc3, 0x28]),
    Buffer.from('","email":"guest@example.test","message":"Development test message","privacy":true,"website":""}'),
  ]);
  const response = await request.post('/api/kontakt', {
    headers: { origin, 'content-type': 'application/json' }, data: body,
  });
  expect(response.status()).toBe(400);
});

test('contact accepts JSON media types case-insensitively with parameters', async ({ request }) => {
  for (const contentType of ['application/json; charset=utf-8', 'Application/JSON']) {
    const response = await request.post('/api/kontakt', {
      headers: { origin, 'content-type': contentType }, data: JSON.stringify(message),
    });
    // Validation succeeds; delivery must still fail honestly until configured.
    expect(response.status(), contentType).toBe(503);
    expect(await response.json()).toEqual({ error: 'delivery_unavailable' });
  }
});

test('contact rejects malformed input and missing or null origin', async ({ request }) => {
  for (const data of ['', '{', 'null', '[]', JSON.stringify({ ...message, privacy: false })]) {
    const response = await request.post('/api/kontakt', {
      headers: { origin, 'content-type': 'application/json' }, data,
    });
    expect(response.status()).toBe(400);
  }
  const missingOrNullOrigins: Record<string, string>[] = [{}, { origin: 'null' }];
  for (const headers of missingOrNullOrigins) {
    expect((await request.post('/api/kontakt', { headers, data: message })).status()).toBe(403);
  }
});
