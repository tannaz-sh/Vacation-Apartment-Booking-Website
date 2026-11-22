import { z } from 'zod';

// Marketing content only. Reservation records and prices belong to Smoobu.
export const apartmentSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1), description: z.string(),
  capacity: z.number().int().positive(), bedrooms: z.number().int().nonnegative(),
  amenities: z.array(z.string()), smoobuApartmentId: z.string().nullable(),
  featuredImage: z.object({ url: z.string(), alt: z.string() }).nullable().optional(),
  gallery: z.array(z.object({ url: z.string(), alt: z.string(), caption: z.string().nullable() })).optional(),
  arrival: z.string().nullable().optional(), houseRules: z.string().nullable().optional(),
  status: z.enum(['draft', 'published']), fixture: z.boolean(),
});
export type Apartment = z.infer<typeof apartmentSchema>;
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(5000),
  privacy: z.literal(true),
  website: z.string().max(0),
});
export function filterApartments(apartments: Apartment[], guests: number, amenity: string) {
  return apartments.filter(a => a.status === 'published' && a.capacity >= guests && (!amenity || a.amenities.includes(amenity)));
}
export function bookingUrl(raw: string | undefined, allowedHost: string | undefined): string | null {
  if (!raw || !allowedHost) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.hostname !== allowedHost || url.username || url.password || url.port) return null;
    return url.href;
  } catch { return null; }
}
export type Faq = { question: string; answer: string; approved: boolean };
export function searchFaq(entries: Faq[], query: string) {
  const words = query.toLocaleLowerCase('de').trim().split(/\s+/).filter(Boolean);
  return entries.filter(entry => entry.approved && words.every(word => `${entry.question} ${entry.answer}`.toLocaleLowerCase('de').includes(word)));
}
