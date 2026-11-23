import { z } from 'zod';

export const supportPages = [
  { value: 'all', label: 'Alle Seiten' },
  { value: '/', label: 'Startseite' },
  { value: '/ferienwohnungen', label: 'Ferienwohnungen – Übersicht' },
  { value: '/ferienwohnungen/*', label: 'Alle Wohnungsdetailseiten' },
  { value: '/buchen', label: 'Buchung' },
  { value: '/ueber-uns', label: 'Über uns' },
  { value: '/kontakt', label: 'Kontakt' },
  { value: '/faq', label: 'FAQ' },
  { value: '/impressum', label: 'Impressum' },
  { value: '/datenschutz', label: 'Datenschutz' },
  { value: '/buchungsbedingungen', label: 'Buchungsbedingungen' },
] as const;

export const supportTopicSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  title: z.string().trim().min(1).max(120),
  page: z.string().refine(value => supportPages.some(page => page.value === value)),
  section: z.string().max(120).nullable().optional(),
  order: z.number().default(0),
  questions: z.array(z.object({
    id: z.union([z.string(), z.number()]).optional().nullable(),
    question: z.string().trim().min(1).max(240),
    answer: z.string().trim().min(1).max(5000),
  })).min(1).max(50),
});
export type SupportTopic = z.infer<typeof supportTopicSchema>;

export function topicsForPage(topics: SupportTopic[], pathname: string) {
  const page = pathname.replace(/\/+$/, '') || '/';
  return topics.filter(topic => topic.page === 'all' || topic.page === page ||
    (topic.page === '/ferienwohnungen/*' && /^\/ferienwohnungen\/[^/]+$/.test(page)))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'de'));
}

// Copy only public fields. Invalid or unpublished records never reach the client.
export function publicSupportTopics(records: unknown[]): SupportTopic[] {
  return records.flatMap(record => {
    if (!record || typeof record !== 'object' || !('_status' in record) || record._status !== 'published') return [];
    const parsed = supportTopicSchema.safeParse(record);
    return parsed.success ? [parsed.data] : [];
  });
}
