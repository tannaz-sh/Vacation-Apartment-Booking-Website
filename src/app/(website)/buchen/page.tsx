import Link from 'next/link';
import { CmsSections } from '@/components/cms-sections';
import { bookingUrl } from '@/lib/domain';
import { getPage, getPageMetadata } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const generateMetadata = () => getPageMetadata('buchen', 'Buchung');
export default async function Booking() {
  const page = await getPage('buchen');
  const url = bookingUrl(process.env.SMOOBU_BOOKING_URL, process.env.SMOOBU_BOOKING_HOST);
  return <><div className="breadcrumbs"><Link href="/">Startseite</Link> / Buchung</div><div className="eyebrow">{page?.eyebrow ?? 'IHRE REISE BEGINNT HIER'}</div><h1>{page?.title ?? 'Verfügbarkeit & Buchung'}</h1><p className="lead">{page?.intro ?? 'Reisedaten, verfügbare Unterkünfte und verbindliche Preise sehen Sie direkt im Buchungsportal.'}</p><CmsSections sections={page?.sections}/>{url ? <><a className="button" href={url} rel="noreferrer">Smoobu-Buchungsportal öffnen</a><p>Eine Buchung ist erst mit der Bestätigung des Buchungsanbieters bestätigt.</p></> : <div className="status-panel" role="status"><h2>Online-Buchung derzeit nicht verfügbar</h2><p>Der Buchungsservice ist noch nicht eingerichtet. Es wurde keine Reservierung vorgenommen.</p><Link href="/kontakt">Zum Kontakt</Link></div>}</>;
}
