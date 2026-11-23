import { getPayload } from 'payload';
import config from '../src/payload.config.ts';
import { cmsConfigured } from '../src/lib/cms-settings.ts';

if (!cmsConfigured()) throw new Error('Set DATABASE_URL and a PAYLOAD_SECRET of at least 32 characters.');
const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
if (!email || !password || password.length < 14) throw new Error('Provide bootstrap email and a strong password (minimum 14 characters) through the environment.');
const payload = await getPayload({ config });
try {
  const existing = await payload.count({ collection: 'admins', overrideAccess: true });
  if (existing.totalDocs !== 0) throw new Error('An administrator already exists; bootstrap is disabled.');
  await payload.create({ collection: 'admins', overrideAccess: true, context: { bootstrapAdmin: true }, data: { email, password } });
  console.log('Administrator created. Remove the bootstrap variables from the environment.');
} finally { await payload.destroy(); }
