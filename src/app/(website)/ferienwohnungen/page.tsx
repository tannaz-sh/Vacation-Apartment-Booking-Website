import Link from 'next/link';
import Image from 'next/image';
import { getApartments, fixturesEnabled } from '@/lib/content';
import { filterApartments } from '@/lib/domain';
export const metadata = { title: 'Ferienwohnungen' };
export const dynamic = 'force-dynamic';
export default async function Apartments({searchParams}: {searchParams: Promise<Record<string, string | string[] | undefined>>}) {
  const params = await searchParams;
  const guests = typeof params.gaeste === 'string' && /^[1-9]\d?$/.test(params.gaeste) ? Number(params.gaeste) : 1;
  const amenity = typeof params.ausstattung === 'string' ? params.ausstattung : '';
  const all = await getApartments();
  const apartments = filterApartments(all, guests, amenity);
  return <><div className="breadcrumbs"><Link href="/">Startseite</Link> / Ferienwohnungen</div><div className="eyebrow">FERIENDOMIZILE IM SAUERLAND</div><h1>Ferienwohnungen in Winterberg</h1><p className="lead">Finden Sie die passende Unterkunft für Ihre Auszeit.</p>{fixturesEnabled && <p role="note">Demodaten: Alle angezeigten Wohnungen sind Entwicklungsbeispiele und nicht buchbar.</p>}
    <form className="filters"><label>Gäste<input name="gaeste" type="number" min="1" max="99" defaultValue={guests}/></label><label><span id="listing-amenity-label">Ausstattung</span><select aria-labelledby="listing-amenity-label" name="ausstattung" defaultValue={amenity}><option value="">Alle</option><option>WLAN</option><option>Küche</option><option>Balkon</option></select></label><button>Filtern</button><Link href="/ferienwohnungen">Zurücksetzen</Link></form>
    {apartments.length ? <div className="grid">{apartments.map(a => <article className="card" key={a.slug}>{a.featuredImage && <Image src={a.featuredImage.url} alt={a.featuredImage.alt} width={800} height={600} unoptimized/>}<h2>{a.title}</h2><p>{a.description}</p><p>Bis zu {a.capacity} Gäste · {a.bedrooms} Schlafzimmer</p><p>{a.amenities.join(' · ')}</p><Link href={`/ferienwohnungen/${a.slug}`}>Unterkunft ansehen</Link></article>)}</div> : <p className="status-panel" role="status">{all.length ? 'Keine passende Unterkunft gefunden. Bitte ändern Sie Ihre Filter.' : 'Unsere Unterkünfte werden gerade vorbereitet. Bitte schauen Sie später wieder vorbei.'}</p>}</>;
}
