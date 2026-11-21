import Link from 'next/link';
import { bookingUrl } from '@/lib/domain';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Buchung' };
export default function Booking() {
  const url = bookingUrl(process.env.SMOOBU_BOOKING_URL, process.env.SMOOBU_BOOKING_HOST);
  return <><div className="breadcrumbs"><Link href="/">Startseite</Link> / Buchung</div><div className="eyebrow">IHRE REISE BEGINNT HIER</div><h1>Verfügbarkeit & Buchung</h1>{url ? <><p>Im Smoobu-Buchungsportal wählen Sie Unterkunft, Reisedaten und Gästezahl. Dort sehen Sie die verbindlichen Preise und Bedingungen.</p><a className="button" href={url} rel="noreferrer">Smoobu-Buchungsportal öffnen</a><p>Eine Buchung ist erst mit der Bestätigung des Buchungsanbieters bestätigt.</p></> : <div className="status-panel" role="status"><h2>Online-Buchung derzeit nicht verfügbar</h2><p>Der Buchungsservice ist noch nicht eingerichtet. Es wurde keine Reservierung vorgenommen.</p><Link href="/kontakt">Zum Kontakt</Link></div>}</>;
}
