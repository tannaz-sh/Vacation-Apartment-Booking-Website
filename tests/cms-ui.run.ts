import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { getPayload } from 'payload';

// All data in this run is synthetic. Refuse customer/remote databases.
const raw = process.env.TEST_DATABASE_URL;
if (!raw) throw new Error('TEST_DATABASE_URL is required.');
const db = new URL(raw);
if (!['127.0.0.1', 'localhost'].includes(db.hostname) || db.pathname !== '/support_review_test') {
  throw new Error('Tests require the isolated local support_review_test database.');
}
process.env.DATABASE_URL = raw;
process.env.PAYLOAD_SECRET = randomBytes(48).toString('hex');
process.env.SITE_URL = 'http://127.0.0.1:5144';
const prefix = `UI test ${randomBytes(6).toString('hex')}`;
const email = `${randomBytes(8).toString('hex')}@example.test`;
const password = randomBytes(24).toString('base64url');
const { default: config } = await import('../src/payload.config.ts');
const payload = await getPayload({ config });
let adminId: number | undefined;
try {
  await payload.db.migrate();
  const admin = await payload.create({ collection: 'admins', data: { email, password },
    overrideAccess: true, context: { bootstrapAdmin: true } });
  adminId = admin.id;
  // Credentials exist only for this local test database; never save a session file.
  const child = spawn(process.execPath, ['node_modules/@playwright/test/cli.js', 'test',
    '--config', 'playwright.cms.config.ts', ...process.argv.slice(2)], {
    env: { ...process.env, CMS_TEST_EMAIL: email, CMS_TEST_PASSWORD: password, CMS_TEST_PREFIX: prefix },
    stdio: 'inherit',
  });
  process.exitCode = await new Promise<number>((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', code => resolve(code ?? 1));
  });
} finally {
  // Include documents left by interrupted/failed UI steps, but only this run's prefix.
  await payload.delete({ collection: 'support-topics',
    where: { title: { contains: prefix } }, overrideAccess: true });
  if (adminId) await payload.delete({ collection: 'admins', id: adminId, overrideAccess: true });
  await payload.destroy();
}
