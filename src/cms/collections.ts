import { APIError, type CollectionConfig } from 'payload';
import { isAdmin, publishedOrAdmin } from './access.ts';
import { supportPages } from '../lib/support.ts';

export const Admins: CollectionConfig = {
  slug: 'admins', labels: { singular: 'Administrator', plural: 'Administratoren' },
  admin: { useAsTitle: 'email' },
  auth: { tokenExpiration: 7200, maxLoginAttempts: 5, lockTime: 600000,
    cookies: { sameSite: 'Strict', secure: process.env.SITE_URL?.startsWith('https://') ?? false } },
  access: { admin: ({ req }) => req.user?.collection === 'admins', create: isAdmin, read: isAdmin,
    update: isAdmin, delete: isAdmin },
  hooks: { beforeChange: [({ operation, req, data }) => {
    // Payload's first-register route bypasses create access. Block it here too.
    if (operation === 'create' && req.user?.collection !== 'admins' && req.context.bootstrapAdmin !== true) {
      throw new APIError('Öffentliche Registrierung ist nicht erlaubt.', 403);
    }
    return data;
  }] },
  fields: [{ name: 'name', label: 'Name', type: 'text', maxLength: 120 }],
};

export const SupportTopics: CollectionConfig = {
  slug: 'support-topics', labels: { singular: 'Support-Thema', plural: 'Support-Themen' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'page', 'section', '_status'],
    description: 'Themen und Antworten für das Hilfe-Fenster. Nur freigegebene Inhalte veröffentlichen.' },
  access: { create: isAdmin, read: publishedOrAdmin, update: isAdmin, delete: isAdmin, readVersions: isAdmin },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'title', label: 'Thema', type: 'text', required: true, maxLength: 120 },
    { name: 'page', label: 'Auf welcher Seite anzeigen?', type: 'select', required: true, defaultValue: 'all', options: [...supportPages] },
    { name: 'section', label: 'Bereich der Seite', type: 'text', maxLength: 120,
      admin: { description: 'Zum Beispiel Ausstattung, Anreise oder Bezahlung. Wird im Hilfe-Fenster unter dem Thema angezeigt.' } },
    { name: 'order', label: 'Reihenfolge', type: 'number', defaultValue: 0, required: true, min: 0, max: 10000 },
    { name: 'questions', label: 'Fragen und Antworten', type: 'array', required: true, minRows: 1, maxRows: 50,
      labels: { singular: 'Frage', plural: 'Fragen' }, fields: [
        { name: 'question', label: 'Frage', type: 'text', required: true, maxLength: 240 },
        { name: 'answer', label: 'Antwort', type: 'textarea', required: true, maxLength: 5000 },
      ] },
  ],
};
