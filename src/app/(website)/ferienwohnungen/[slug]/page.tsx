import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getApartmentBySlug } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const apartment = await getApartmentBySlug((await params).slug);
  return { title: apartment?.title ?? 'Ferienwohnung', description: apartment?.description };
}

export default async function Apartment({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const apartment = await getApartmentBySlug(slug);
  if (!apartment) notFound();

  return <>
    <div className="breadcrumbs"><Link href="/">Startseite</Link> / <Link href="/ferienwohnungen">Ferienwohnungen</Link> / {apartment.title}</div>
    <div className="eyebrow">FERIENDOMIZIL IM SAUERLAND</div>
    <h1>{apartment.title}</h1>
    {apartment.featuredImage && <Image src={apartment.featuredImage.url} alt={apartment.featuredImage.alt} width={1200} height={900} unoptimized />}
    {apartment.fixture && <p role="note">Entwicklungsbeispiel · Kein buchbares Angebot</p>}
    <p className="lead">{apartment.description}</p>
    {apartment.gallery?.length ? <div className="grid">{apartment.gallery.map(image => <figure className="card" key={image.url}><Image src={image.url} alt={image.alt} width={800} height={600} unoptimized />{image.caption && <figcaption>{image.caption}</figcaption>}</figure>)}</div> : null}
    <section className="section"><h2>Ausstattung</h2><ul>{apartment.amenities.map(amenity => <li key={amenity}>{amenity}</li>)}</ul><p>Bis zu {apartment.capacity} Gäste · {apartment.bedrooms} Schlafzimmer</p></section>
    {apartment.arrival && <section className="section"><h2>An- und Abreise</h2><p className="cms-body">{apartment.arrival}</p></section>}
    {apartment.houseRules && <section className="section"><h2>Hausregeln</h2><p className="cms-body">{apartment.houseRules}</p></section>}
    <section className="status-panel"><h2>Verfügbarkeit & Buchung</h2><p>Reisedaten, verbindliche Preise und Bedingungen werden im Smoobu-Buchungsportal geprüft.</p><Link className="button" href="/buchen">Zum Buchungsportal</Link></section>
  </>;
}
