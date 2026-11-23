import test from 'node:test';
import assert from 'node:assert/strict';
import { publicSupportTopics, topicsForPage } from '../src/lib/support.ts';
import { smoobuEmbedUrl, configuredBookingEmbed } from '../src/lib/booking-embed.ts';

const record = { id: 1, title: 'Test topic', page: 'all', order: 0, _status: 'published',
  questions: [{ question: 'Test question?', answer: 'A synthetic test answer.' }] };

test('only valid published support content is exposed; internal fields are removed', () => {
  const topics = publicSupportTopics([record, {...record, _status: 'draft'}, {...record, questions: []},
    {...record, page: '/admin'}, null, { ...record, id: 2, internalNote: 'private' }]);
  assert.equal(topics.length, 2);
  assert.equal('internalNote' in topics[1], false);
  assert.equal('_status' in topics[0], false);
});
test('topics respect exact page and apartment detail scopes, not arbitrary prefixes', () => {
  const topics = publicSupportTopics([record, {...record, id: 2, page: '/buchen'},
    {...record, id: 3, page: '/ferienwohnungen/*'}, {...record, id: 4, page: '/ferienwohnungen'}]);
  assert.deepEqual(topicsForPage(topics, '/buchen/').map(t => t.id), ['1', '2']);
  assert.deepEqual(topicsForPage(topics, '/ferienwohnungen/demo').map(t => t.id), ['1', '3']);
  assert.deepEqual(topicsForPage(topics, '/ferienwohnungen').map(t => t.id), ['1', '4']);
  assert.deepEqual(topicsForPage(topics, '/buchen-evil').map(t => t.id), ['1']);
});
test('topic ordering is deterministic without mutating source', () => {
  const topics = publicSupportTopics([{...record, id: 1, order: 5}, {...record, id: 2, order: 1}]);
  assert.deepEqual(topicsForPage(topics, '/').map(t => t.id), ['2', '1']);
  assert.deepEqual(topics.map(t => t.id), ['1', '2']);
});
test('booking accepts only official Smoobu embed addresses', () => {
  assert.equal(smoobuEmbedUrl(configuredBookingEmbed), configuredBookingEmbed);
  for (const url of [undefined, 'https://booking.smoobu.com/example',
    'https://login.smoobu.com.evil.test/de/booking-tool/iframe/1947006',
    'https://login.smoobu.com/de/booking-tool/iframe/1947006?redirect=https://evil.test',
    'https://user:pass@login.smoobu.com/de/booking-tool/iframe/1947006',
    'http://login.smoobu.com/de/booking-tool/iframe/1947006',
    'https://login.smoobu.com/de/booking-tool/iframe/1947006#x',
    'https://login.smoobu.com:8443/de/booking-tool/iframe/1947006']) assert.equal(smoobuEmbedUrl(url), null);
});
