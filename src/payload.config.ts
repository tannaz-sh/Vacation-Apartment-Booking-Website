import path from 'node:path';
import { buildConfig, type Access, type CollectionConfig, type Field } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import sharp from 'sharp';

const authenticated: Access = ({ req }) => Boolean(req.user);
const authenticatedAdmin = ({ req }: Parameters<Access>[0]) => Boolean(req.user);
const published: Access = ({ req }) => req.user ? true : { _status: { equals: 'published' } };
const editorialAccess = { read: published, create: authenticated, update: authenticated, delete: authenticated, readVersions: authenticated };
const seo: Field = { name: 'seo', type: 'group', fields: [
  { name: 'title', type: 'text' }, { name: 'description', type: 'textarea', maxLength: 320 },
] };
const slug: Field = { name: 'slug', type: 'text', required: true, unique: true,
  validate: (value: unknown) => typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || 'Use lowercase letters, digits and hyphens.' };
const preview = (collection: string) => (doc: { id?: string | number }) => `/vorschau/${collection}/${doc.id}`;
const users: CollectionConfig = {
  slug: 'users', admin: { useAsTitle: 'email' },
  auth: { maxLoginAttempts: 5, lockTime: 600_000, tokenExpiration: 7200, cookies: { sameSite: 'Lax', secure: false } },
  access: { read: authenticated, create: authenticated, update: authenticated, delete: authenticated, admin: authenticatedAdmin },
  fields: [{ name: 'name', type: 'text', required: true }],
};
const media: CollectionConfig = {
  slug: 'media', admin: { useAsTitle: 'alt' },
  access: { read: ({ req }) => req.user ? true : { visibility: { equals: 'public' } }, create: authenticated, update: authenticated, delete: authenticated },
  upload: { staticDir: path.resolve('.local/media'), mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'], imageSizes: [{ name: 'card', width: 800, height: 600, fit: 'inside' }] },
  fields: [{ name: 'alt', type: 'text', required: true }, { name: 'visibility', type: 'select', required: true, defaultValue: 'private', options: ['private', 'public'], admin: { description: 'Only approved public images are visible to website visitors.' } }],
};
const apartments: CollectionConfig = {
  slug: 'apartments', admin: { useAsTitle: 'title', preview: preview('apartments'), defaultColumns: ['title', 'slug', '_status'] },
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
  slug: 'pages', admin: { useAsTitle: 'title', preview: preview('pages') }, access: editorialAccess,
  versions: { drafts: true, maxPerDoc: 30 }, fields: [
    { name: 'slug', type: 'select', unique: true, required: true, options: ['startseite', 'ueber-uns', 'kontakt', 'impressum', 'datenschutz', 'buchungsbedingungen'] },
    { name: 'title', type: 'text', required: true }, { name: 'intro', type: 'textarea' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'sections', type: 'array', fields: [{ name: 'eyebrow', type: 'text' }, { name: 'title', type: 'text', required: true }, { name: 'body', type: 'textarea', required: true }, { name: 'image', type: 'upload', relationTo: 'media' }] }, seo,
  ],
};
const faqs: CollectionConfig = { slug: 'faqs', admin: { useAsTitle: 'question' }, access: editorialAccess,
  versions: { drafts: true, maxPerDoc: 30 }, fields: [
    { name: 'question', type: 'text', required: true }, { name: 'answer', type: 'textarea', required: true },
    { name: 'order', type: 'number', defaultValue: 0 },
  ] };

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.SITE_URL || 'http://127.0.0.1:3000',
  routes: { admin: '/admin', api: '/api/cms' },
  admin: { user: 'users', importMap: { baseDir: path.resolve('src') } },
  csrf: [process.env.SITE_URL || 'http://127.0.0.1:3000'],
  graphQL: { disable: true },
  collections: [users, media, apartments, pages, faqs], sharp,
  upload: { limits: { fileSize: 10 * 1024 * 1024 } },
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL }, push: process.env.PAYLOAD_DB_PUSH === 'true', migrationDir: path.resolve('src/migrations') }),
  typescript: { outputFile: path.resolve('src/payload-types.ts') },
});
