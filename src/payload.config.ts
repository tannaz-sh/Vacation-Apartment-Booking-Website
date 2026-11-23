import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { de } from '@payloadcms/translations/languages/de';
import { Admins, SupportTopics } from './cms/collections.ts';

const dirname = path.dirname(fileURLToPath(import.meta.url));
export default buildConfig({
  // No reusable fallback credential: routes are disabled until a persistent secret is set.
  secret: process.env.PAYLOAD_SECRET || randomBytes(48).toString('hex'),
  serverURL: process.env.SITE_URL || 'http://127.0.0.1:3000',
  routes: { admin: '/admin', api: '/api/cms' },
  admin: { user: 'admins', importMap: { baseDir: dirname }, meta: { titleSuffix: ' | RF Sauerland Verwaltung' } },
  i18n: { supportedLanguages: { de }, fallbackLanguage: 'de' },
  cors: [], csrf: process.env.SITE_URL ? [process.env.SITE_URL] : [],
  collections: [Admins, SupportTopics],
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 5000 },
    push: false, migrationDir: path.resolve(dirname, 'migrations') }),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  graphQL: { disable: true },
  telemetry: false,
  email: () => ({ name: 'disabled-until-configured', defaultFromAddress: 'unconfigured@example.invalid',
    defaultFromName: 'RF Sauerland Immobilien', sendEmail: async () => { throw new Error('Email transport is not configured.'); } }),
});
