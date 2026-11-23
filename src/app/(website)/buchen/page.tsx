import Link from 'next/link';
import { BookingEmbed } from '@/components/booking-embed';
import { configuredBookingEmbed, smoobuEmbedUrl } from '@/lib/booking-embed';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Buchung' };
export default function Booking() {
  const url = smoobuEmbedUrl(process.env.SMOOBU_EMBED_URL ?? configuredBookingEmbed);
  return <><div className="breadcrumbs"><Link href="/">Startseite</Link> / Buchung</div><div className="eyebrow">IHRE REISE BEGINNT HIER</div><h1>Verfügbarkeit & Buchung</h1>
    <p>Wählen Sie Ihre Unterkunft und Reisedaten im Formular auf dieser Seite. Preise, Bedingungen und Buchungsbestätigung werden von Smoobu bereitgestellt.</p>
    {url ? <BookingEmbed url={url}/> : <div className="status-panel" role="status"><h2>Online-Buchung derzeit nicht verfügbar</h2><p>Es wurde keine Reservierung vorgenommen.</p><Link href="/kontakt">Zum Kontakt</Link></div>}
  </>;
}
