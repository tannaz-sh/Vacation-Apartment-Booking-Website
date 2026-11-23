import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { spawn, type ChildProcess } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { getPayload } from 'payload';

// Explicit isolated database only. Never run this against a customer database.
const raw = process.env.TEST_DATABASE_URL;
if (!raw) throw new Error('TEST_DATABASE_URL is required.');
const db = new URL(raw);
if (!['127.0.0.1', 'localhost'].includes(db.hostname) || db.pathname !== '/support_review_test') {
  throw new Error('Tests require the isolated local support_review_test database.');
}
process.env.DATABASE_URL = raw;
process.env.PAYLOAD_SECRET ??= randomBytes(48).toString('hex');
const { default: config } = await import('../src/payload.config.ts');
const payload = await getPayload({ config });
const password = randomBytes(24).toString('base64url');
const email = `review-${randomBytes(6).toString('hex')}@example.test`;
let adminId: number | undefined;
let topicId: number | undefined;
let assertions = 0;
let server: ChildProcess | undefined;
const verify = (condition: unknown) => { assert.ok(condition); assertions++; };
const denied = async (fn: () => Promise<unknown>) => { await assert.rejects(fn); assertions++; };
try {
  await payload.db.migrate();
  await denied(() => payload.create({ collection: 'admins', data: { email, password }, overrideAccess: false, user: null }));
  // This is the path used by first-register, which bypasses normal create access.
  await denied(() => payload.create({ collection: 'admins', data: { email, password }, overrideAccess: true }));
  const admin = await payload.create({ collection: 'admins', data: { email, password }, overrideAccess: true, context: { bootstrapAdmin: true } });
  adminId = admin.id;
  const { user } = await payload.login({ collection: 'admins', data: { email, password } });
  assert.ok(user);
  verify(user.id === admin.id);
  const auth = { ...user, collection: 'admins' as const };
  const data = { title: 'Development test only', page: '/buchen' as const, section: 'Test area', order: 1,
    questions: [{ question: 'Synthetic test question?', answer: 'Synthetic answer, not a guest policy.' }], _status: 'draft' as const };
  await denied(() => payload.create({ collection: 'support-topics', data, overrideAccess: false, user: null }));
  const topic = await payload.create({ collection: 'support-topics', data, overrideAccess: false, user: auth, draft: true });
  topicId = topic.id;
  const publicRead = () => payload.find({ collection: 'support-topics', where: { id: { equals: topicId } }, overrideAccess: false, user: null, draft: true });
  verify((await publicRead()).docs.length === 0);
  await denied(() => payload.findByID({ collection: 'support-topics', id: topicId!, overrideAccess: false, user: null, draft: true }));
  await denied(() => payload.update({ collection: 'support-topics', id: topicId!, data: { title: 'Unauthorized' }, overrideAccess: false, user: null }));
  await denied(() => payload.delete({ collection: 'support-topics', id: topicId!, overrideAccess: false, user: null }));
  await denied(() => payload.findVersions({ collection: 'support-topics', overrideAccess: false, user: null }));
  await payload.update({ collection: 'support-topics', id: topic.id, data: { _status: 'published' }, overrideAccess: false, user: auth });
  verify((await publicRead()).docs.length === 1);
  await payload.update({ collection: 'support-topics', id: topic.id, draft: true,
    data: { title: 'Unpublished private revision' }, overrideAccess: false, user: auth });
  verify((await publicRead()).docs.every(doc => doc.title !== 'Unpublished private revision'));
  const publishedOnly = await payload.find({ collection: 'support-topics', where: { id: { equals: topicId } }, overrideAccess: false, user: null, draft: false });
  verify(publishedOnly.docs.length === 1 && publishedOnly.docs[0].title === 'Development test only');
  await payload.update({ collection: 'support-topics', id: topic.id, data: { _status: 'published', title: 'Edited topic', questions: [{ question: 'Edited question?', answer: 'Edited test answer.' }] }, overrideAccess: false, user: auth });
  verify((await publicRead()).docs[0].title === 'Edited topic');
  verify((await publicRead()).docs[0].questions[0].answer === 'Edited test answer.');
  // Exercise the built HTTP boundary too, including cookie authentication and CSRF origin.
  const origin = 'http://127.0.0.1:5143';
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '5143'], {
    env: { ...process.env, SITE_URL: origin }, stdio: 'ignore',
  });
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    try { ready = (await fetch(`${origin}/admin/login`)).ok; } catch { /* Startup in progress. */ }
    if (ready) break;
    await delay(100);
  }
  verify(ready);
  const request = (path: string, init: RequestInit = {}) => fetch(`${origin}/api/cms/${path}`, init);
  const jsonHeaders = { 'Content-Type': 'application/json', Origin: origin };
  verify((await request('admins/first-register', { method: 'POST', headers: jsonHeaders, body: JSON.stringify({ email, password }) })).status === 403);
  verify([401, 403].includes((await request('support-topics', { method: 'POST', headers: jsonHeaders, body: JSON.stringify(data) })).status));
  const loginResponse = await request('admins/login', { method: 'POST', headers: jsonHeaders, body: JSON.stringify({ email, password }) });
  verify(loginResponse.ok);
  const cookie = loginResponse.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
  verify(cookie.length > 0);
  const sessionHeaders = { ...jsonHeaders, Cookie: cookie };
  verify((await request('admins/me', { headers: sessionHeaders })).ok);
  const me = await (await request('admins/me', { headers: sessionHeaders })).json();
  verify(me.user?.id === admin.id);
  verify([401, 403].includes((await request('admins')).status));
  verify([401, 403].includes((await request('support-topics/versions')).status));
  verify([401, 403].includes((await request(`support-topics/${topic.id}`, { method: 'PATCH', headers: jsonHeaders, body: JSON.stringify({ title: 'Anonymous edit' }) })).status));
  verify([401, 403].includes((await request(`support-topics/${topic.id}`, { method: 'DELETE', headers: jsonHeaders })).status));
  const adminPagePath = `/admin/collections/support-topics/${topic.id}`;
  const anonymousPage = await fetch(`${origin}${adminPagePath}`, { redirect: 'manual' });
  const anonymousHtml = await anonymousPage.text();
  // Next may already have streamed the shell: the client then receives the redirect digest.
  const loginRedirect = anonymousPage.headers.get('location')?.startsWith('/admin/login') ||
    anonymousHtml.includes('NEXT_REDIRECT;replace;/admin/login?');
  verify(loginRedirect && !anonymousHtml.includes('Edited topic') && !anonymousHtml.includes('Edited test answer.'));
  for (const path of ['/admin', '/admin/collections/support-topics', '/admin/collections/support-topics/create', adminPagePath]) {
    const pageResponse = await fetch(`${origin}${path}`, { headers: { Cookie: cookie, 'Sec-Fetch-Site': 'none', 'Sec-Fetch-Mode': 'navigate', 'Sec-Fetch-Dest': 'document' }, redirect: 'manual' });
    const html = await pageResponse.text();
    verify(pageResponse.ok && html.includes('Support-Themen') && !html.includes('NEXT_REDIRECT'));
  }

  const publicResponse = await request(`support-topics/${topic.id}`);
  verify(publicResponse.ok && (await publicResponse.json()).title === 'Edited topic');
  const editedResponse = await request(`support-topics/${topic.id}`, { method: 'PATCH', headers: sessionHeaders, body: JSON.stringify({ title: 'HTTP edited topic' }) });
  verify(editedResponse.ok && (await editedResponse.json()).doc.title === 'HTTP edited topic');
  verify([401, 403].includes((await request(`support-topics/${topic.id}`, { method: 'PATCH', headers: { ...sessionHeaders, Origin: 'https://untrusted.example.test' }, body: JSON.stringify({ title: 'CSRF attempt' }) })).status));
  await payload.update({ collection: 'support-topics', id: topic.id, data: { _status: 'draft' }, overrideAccess: false, user: auth });
  verify((await publicRead()).docs.length === 0);
  const hiddenDraft = await request(`support-topics/${topic.id}?draft=true`);
  verify([401, 403, 404].includes(hiddenDraft.status));
  const draftList = await (await request(`support-topics?draft=true&where[id][equals]=${topic.id}`)).json();
  verify(draftList.docs?.length === 0);
  await payload.delete({ collection: 'support-topics', id: topic.id, overrideAccess: false, user: auth });
  topicId = undefined;
  verify((await payload.find({ collection: 'support-topics', where: { id: { equals: topic.id } }, overrideAccess: false, user: null })).docs.length === 0);
  console.log(`CMS integration: ${assertions} checks passed (real PostgreSQL, Payload auth, draft/read/write/delete restrictions).`);
} finally {
  if (server && server.exitCode === null) {
    const exited = new Promise<void>(resolve => server!.once('exit', () => resolve()));
    server.kill('SIGTERM');
    await Promise.race([exited, delay(5000)]);
    if (server.exitCode === null) server.kill('SIGKILL');
  }
  if (topicId) await payload.delete({ collection: 'support-topics', id: topicId, overrideAccess: true });
  if (adminId) await payload.delete({ collection: 'admins', id: adminId, overrideAccess: true });
  await payload.destroy();
}
