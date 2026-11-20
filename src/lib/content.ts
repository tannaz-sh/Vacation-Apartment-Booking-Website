import 'server-only';
import type { Apartment, Faq } from './domain';

export const fixturesEnabled = process.env.DEVELOPMENT_FIXTURES === 'true' && process.env.NODE_ENV !== 'production';
// Explicit development fixtures; never real accommodation inventory.
const fixtures: Apartment[] = [
  { slug: 'demo-bergzeit', title: 'Demo: Bergzeit', description: 'Entwicklungsbeispiel für eine Ferienwohnung. Kein buchbares Angebot.', capacity: 2, bedrooms: 1, amenities: ['WLAN', 'Küche'], smoobuApartmentId: null, status: 'published', fixture: true },
  { slug: 'demo-waldblick', title: 'Demo: Waldblick', description: 'Entwicklungsbeispiel für die Filterfunktion. Kein buchbares Angebot.', capacity: 4, bedrooms: 2, amenities: ['WLAN', 'Küche', 'Balkon'], smoobuApartmentId: null, status: 'published', fixture: true },
];
export async function getApartments(): Promise<Apartment[]> { return fixturesEnabled ? fixtures : []; }
// Client-approved answers must be supplied before publishing. No invented policies.
export const approvedFaqs: Faq[] = [];
