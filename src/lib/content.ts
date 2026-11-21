import 'server-only';
import { getPayload } from 'payload';
import config from '@payload-config';
import type { Page } from '@/payload-types';
import type { Apartment, Faq } from './domain';

export const fixturesEnabled = process.env.DEVELOPMENT_FIXTURES === 'true' && process.env.NODE_ENV !== 'production';
// Explicit development fixtures; never real accommodation inventory.
const fixtures: Apartment[] = [
  { slug: 'demo-bergzeit', title: 'Demo: Bergzeit', description: 'Entwicklungsbeispiel für eine Ferienwohnung. Kein buchbares Angebot.', capacity: 2, bedrooms: 1, amenities: ['WLAN', 'Küche'], smoobuApartmentId: null, status: 'published', fixture: true },
  { slug: 'demo-waldblick', title: 'Demo: Waldblick', description: 'Entwicklungsbeispiel für die Filterfunktion. Kein buchbares Angebot.', capacity: 4, bedrooms: 2, amenities: ['WLAN', 'Küche', 'Balkon'], smoobuApartmentId: null, status: 'published', fixture: true },
];
export async function getApartments(): Promise<Apartment[]> {
  if (fixturesEnabled) return fixtures;
  const payload = await getPayload({ config });
  const result = await payload.find({ collection: 'apartments', overrideAccess: false, draft: false, depth: 1, limit: 100, sort: 'title' });
  return result.docs.map(apartment => ({
    slug: apartment.slug, title: apartment.title, description: apartment.description,
    capacity: apartment.capacity, bedrooms: apartment.bedrooms,
    amenities: apartment.amenities?.map(item => item.label) ?? [],
    smoobuApartmentId: apartment.smoobuApartmentId ?? null,
    featuredImage: typeof apartment.featuredImage === 'object' && apartment.featuredImage?.url
      ? { url: apartment.featuredImage.url, alt: apartment.featuredImage.alt } : null,
    status: 'published', fixture: false,
  }));
}
export async function getApartmentBySlug(slug: string): Promise<Apartment | null> {
  return (await getApartments()).find(apartment => apartment.slug === slug) ?? null;
}
export async function getPage(slug: Page['slug']): Promise<Page | null> {
  const payload = await getPayload({ config });
  const result = await payload.find({ collection: 'pages', overrideAccess: false, draft: false, depth: 1, limit: 1, where: { slug: { equals: slug } } });
  return result.docs[0] ?? null;
}
// Client-approved answers must be supplied before publishing. No invented policies.
export async function getApprovedFaqs(): Promise<Faq[]> {
  const payload = await getPayload({ config });
  const result = await payload.find({ collection: 'faqs', overrideAccess: false, draft: false, limit: 100, sort: 'order' });
  return result.docs.map(faq => ({ question: faq.question, answer: faq.answer, approved: true }));
}
