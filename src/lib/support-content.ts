import 'server-only';
import { cache } from 'react';
import { connection } from 'next/server';
import { cmsConfigured } from './cms-settings';
import { publicSupportTopics } from './support';

export const getSupportContent = cache(async () => {
  await connection();
  if (!cmsConfigured()) return { topics: [], unavailable: false };
  try {
    const [{ getPayload }, { default: config }] = await Promise.all([import('payload'), import('../payload.config')]);
    const payload = await getPayload({ config });
    const result = await payload.find({ collection: 'support-topics', overrideAccess: false,
      user: null, draft: false, pagination: false, depth: 0, sort: 'order',
      where: { _status: { equals: 'published' } } });
    return { topics: publicSupportTopics(result.docs), unavailable: false };
  } catch {
    console.error('Support content is temporarily unavailable.');
    return { topics: [], unavailable: true };
  }
});
