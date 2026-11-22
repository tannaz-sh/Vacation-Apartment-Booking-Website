import path from 'node:path';
import { buildConfig, type Access, type CollectionConfig, type Field, type GlobalConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { de } from '@payloadcms/translations/languages/de';
import sharp from 'sharp';

function requiredEnv(name: 'DATABASE_URL' | 'PAYLOAD_SECRET') {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

const siteURL = new URL(process.env.SITE_URL || 'http://127.0.0.1:3000');
if (!['http:', 'https:'].includes(siteURL.protocol) || siteURL.username || siteURL.password) {
  throw new Error('SITE_URL must be a credential-free HTTP(S) URL.');
}
const secureCookies = siteURL.protocol === 'https:';
const allowSchemaPush = process.env.PAYLOAD_DB_PUSH === 'true' && (process.env.NODE_ENV !== 'production' || process.env.CI === 'true');

const authenticated: Access = ({ req }) => Boolean(req.user);
const authenticatedAdmin = ({ req }: Parameters<Access>[0]) => Boolean(req.user);
const administrator: Access = ({ req }) => req.user?.collection === 'users' && req.user.role === 'admin';
const published: Access = ({ req }) => req.user ? true : { _status: { equals: 'published' } };
const editorialAccess = { read: published, create: authenticated, update: authenticated, delete: authenticated, readVersions: authenticated };
const seo: Field = { name: 'seo', type: 'group', fields: [
  { name: 'title', type: 'text' }, { name: 'description', type: 'textarea', maxLength: 320 },
] };
const slug: Field = { name: 'slug', type: 'text', required: true, unique: true,
  validate: (value: unknown) => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || 'Use lowercase letters, digits and hyphens.' };
const preview = (collection: string) => (doc: { id?: string | number }) => `/vorschau/${collection}/${doc.id}`;
const contentURL = (value: unknown) => {
  if (!value || typeof value !== 'string') return true;
  if (/^\/[a-z0-9\-/?#=&.%]*$/i.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password || 'Use a local path or a credential-free HTTPS URL.';
  } catch { return 'Use a local path or a credential-free HTTPS URL.'; }
};
const users: CollectionConfig = {
  slug: 'users', labels: { singular: 'Benutzer', plural: 'Benutzer' }, admin: { useAsTitle: 'email', group: 'Administration' },
  auth: { maxLoginAttempts: 5, lockTime: 600_000, tokenExpiration: 7200, cookies: { sameSite: 'Lax', secure: secureCookies } },
  access: { read: administrator, create: administrator, update: administrator, delete: administrator, admin: authenticatedAdmin },
  hooks: { beforeChange: [({ data, req, operation }) => {
    if (operation === 'create' && req.user && !data?.role) return { ...data, role: 'editor' };
    return data;
  }] },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'role', type: 'select', required: true, defaultValue: 'admin', options: [
      { label: 'Administrator', value: 'admin' }, { label: 'Editor', value: 'editor' },
    ], admin: { description: 'Administrators manage users; editors manage website content.' } },
  ],
};
const media: CollectionConfig = {
  slug: 'media', labels: { singular: 'Medium', plural: 'Medien' }, admin: { useAsTitle: 'alt', group: 'Inhalte' },
  access: { read: ({ req }) => req.user ? true : { visibility: { equals: 'public' } }, create: authenticated, update: authenticated, delete: authenticated },
  upload: { staticDir: path.resolve('.local/media'), mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'], imageSizes: [{ name: 'card', width: 800, height: 600, fit: 'inside' }] },
  fields: [{ name: 'alt', type: 'text', required: true }, { name: 'visibility', type: 'select', required: true, defaultValue: 'private', options: ['private', 'public'], admin: { description: 'Only approved public images are visible to website visitors.' } }],
};
const apartments: CollectionConfig = {
  slug: 'apartments', labels: { singular: 'Ferienwohnung', plural: 'Ferienwohnungen' }, admin: { useAsTitle: 'title', preview: preview('apartments'), defaultColumns: ['title', 'slug', '_status'], group: 'Inhalte' },
  access: editorialAccess, versions: { drafts: true, maxPerDoc: 30 },
  fields: [{ name: 'title', type: 'text', required: true }, slug,
    { name: 'description', type: 'textarea', required: true },
    { name: 'capacity', type: 'number', required: true, min: 1 },
    { name: 'bedrooms', type: 'number', required: true, min: 0 },
    { name: 'amenities', type: 'array', fields: [{ name: 'label', type: 'text', required: true }] },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    { name: 'gallery', type: 'array', fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }, { name: 'caption', type: 'text' }] },
    { name: 'arrival', type: 'textarea' }, { name: 'houseRules', type: 'textarea' },
    { name: 'smoobuApartmentId', type: 'text', admin: { description: 'Provider apartment ID only. Availability, prices and bookings remain in Smoobu.' } }, seo],
};
const pages: CollectionConfig = {
  slug: 'pages', labels: { singular: 'Seite', plural: 'Seiten' }, admin: { useAsTitle: 'title', preview: preview('pages'), group: 'Inhalte' }, access: editorialAccess,
  versions: { drafts: true, maxPerDoc: 30 }, fields: [
    { name: 'slug', type: 'select', unique: true, required: true, options: ['startseite', 'ferienwohnungen', 'buchen', 'faq', 'ueber-uns', 'kontakt', 'impressum', 'datenschutz', 'buchungsbedingungen'] },
    { name: 'eyebrow', type: 'text' }, { name: 'title', type: 'text', required: true }, { name: 'intro', type: 'textarea' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'sections', type: 'array', fields: [
      { name: 'layout', type: 'select', required: true, defaultValue: 'text', options: [
        { label: 'Text', value: 'text' }, { label: 'Cards', value: 'cards' },
        { label: 'Image and text', value: 'imageText' }, { label: 'Call to action', value: 'cta' },
      ] },
      { name: 'theme', type: 'select', defaultValue: 'plain', options: ['plain', 'soft', 'dark'] },
      { name: 'eyebrow', type: 'text' }, { name: 'title', type: 'text', required: true },
      { name: 'body', type: 'textarea', required: true }, { name: 'image', type: 'upload', relationTo: 'media' },
      { name: 'items', type: 'array', fields: [
        { name: 'title', type: 'text', required: true }, { name: 'body', type: 'textarea', required: true },
        { name: 'linkLabel', type: 'text' }, { name: 'linkUrl', type: 'text', validate: contentURL },
      ] },
      { name: 'linkLabel', type: 'text' }, { name: 'linkUrl', type: 'text', validate: contentURL },
    ] }, seo,
  ],
};
const faqs: CollectionConfig = { slug: 'faqs', labels: { singular: 'Frage', plural: 'Häufige Fragen' }, admin: { useAsTitle: 'question', group: 'Inhalte' }, access: editorialAccess,
  versions: { drafts: true, maxPerDoc: 30 }, fields: [
    { name: 'question', type: 'text', required: true }, { name: 'answer', type: 'textarea', required: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ] };
const siteSettings: GlobalConfig = {
  slug: 'site-settings', label: 'Website-Einstellungen', access: { read: () => true, update: authenticated },
  versions: { drafts: true, max: 30 },
  fields: [
    { name: 'businessName', type: 'text', required: true, defaultValue: 'RF Sauerland Immobilien' },
    { name: 'locationLine', type: 'text', defaultValue: 'WINTERBERG · HOCHSAUERLANDKREIS' },
    { name: 'previewNotice', type: 'text', defaultValue: 'Entwicklungsvorschau · Inhalte noch nicht freigegeben' },
    { name: 'headerCta', type: 'group', fields: [{ name: 'label', type: 'text' }, { name: 'url', type: 'text', validate: contentURL }] },
    { name: 'navigation', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, { name: 'url', type: 'text', required: true, validate: contentURL }] },
    { name: 'footerText', type: 'textarea' },
    { name: 'footerColumns', type: 'array', maxRows: 3, fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'links', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, { name: 'url', type: 'text', required: true, validate: contentURL }] },
    ] },
    { name: 'legalLinks', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, { name: 'url', type: 'text', required: true, validate: contentURL }] },
    { name: 'contact', type: 'group', fields: [
      { name: 'email', type: 'email' }, { name: 'phone', type: 'text' }, { name: 'address', type: 'textarea' },
    ] },
    { name: 'defaultSeo', type: 'group', fields: [
      { name: 'title', type: 'text', required: true, defaultValue: 'RF Sauerland Immobilien | Ferienwohnungen in Winterberg' },
      { name: 'description', type: 'textarea', maxLength: 320, defaultValue: 'Ferienwohnungen und kurze Auszeiten in Winterberg im Sauerland.' },
    ] },
  ],
};

export default buildConfig({
  secret: requiredEnv('PAYLOAD_SECRET'),
  serverURL: siteURL.origin,
  routes: { admin: '/admin', api: '/api/cms' },
  admin: {
    user: 'users',
    importMap: { baseDir: path.resolve('src') },
    meta: { titleSuffix: '– RF Sauerland CMS' },
    components: {
      graphics: { Logo: '@/components/admin-brand#AdminLogo', Icon: '@/components/admin-brand#AdminIcon' },
      beforeLogin: ['@/components/admin-brand#AdminLoginIntro'],
      beforeDashboard: ['@/components/admin-brand#AdminDashboardIntro'],
    },
  },
  csrf: [siteURL.origin],
  graphQL: { disable: true },
  i18n: { supportedLanguages: { de }, fallbackLanguage: 'de' },
  collections: [users, media, apartments, pages, faqs], globals: [siteSettings], sharp,
  upload: { limits: { fileSize: 10 * 1024 * 1024 } },
  db: postgresAdapter({ pool: { connectionString: requiredEnv('DATABASE_URL') }, push: allowSchemaPush, migrationDir: path.resolve('src/migrations') }),
  typescript: { outputFile: path.resolve('src/payload-types.ts') },
});
