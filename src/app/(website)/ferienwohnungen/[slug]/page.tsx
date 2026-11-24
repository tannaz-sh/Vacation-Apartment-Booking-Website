import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getApartments } from '@/lib/content';
export const dynamicParams = false;
export async function generateStaticParams() { return (await getApartments()).map(({slug}) => ({slug})); }
export default async function Apartment({params}: {params: Promise<{slug: string}>}) {
  const {slug} = await params;
  const apartment = (await getApartments()).find(a => a.slug === slug);
  if (!apartment) notFound();
  return <><Link href="/ferienwohnungen">Alle Ferienwohnungen</Link><h1>{apartment.title}</h1><p role="note">Entwicklungsbeispiel · Kein buchbares Angebot</p><p>{apartment.description}</p><h2>Ausstattung</h2><ul>{apartment.amenities.map(a => <li key={a}>{a}</li>)}</ul><p>Bis zu {apartment.capacity} Gäste · {apartment.bedrooms} Schlafzimmer</p><h2>Anreise & Hausregeln</h2><p>Die Angaben werden vor Veröffentlichung ergänzt.</p><h2>Buchung</h2><p>Dieses Entwicklungsbeispiel kann nicht gebucht werden.</p></>;
}
