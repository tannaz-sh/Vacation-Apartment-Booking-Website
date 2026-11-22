import Link from 'next/link';
import { ContactForm } from '@/components/contact-form';
import { CmsSections } from '@/components/cms-sections';
import { getPage, getPageMetadata, getSiteSettings } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const generateMetadata = () => getPageMetadata('kontakt', 'Kontakt');
export default async function Contact() {
  const [page, settings] = await Promise.all([getPage('kontakt'), getSiteSettings()]);
  return <><div className="breadcrumbs"><Link href="/">Startseite</Link> / Kontakt</div><div className="eyebrow">{page?.eyebrow ?? 'WINTERBERG & SAUERLAND'}</div><h1>{page?.title ?? 'Kontakt aufnehmen'}</h1><p className="lead">{page?.intro ?? 'Ihre Fragen zu einer Ferienwohnung, Ihrer Reiseplanung oder einem Aufenthalt in Winterberg.'}</p><CmsSections sections={page?.sections}/><div className="contact-layout section"><aside><div className="card"><h2>Kontaktdaten</h2>{settings.contact?.email && <p><a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a></p>}{settings.contact?.phone && <p><a href={`tel:${settings.contact.phone}`}>{settings.contact.phone}</a></p>}{settings.contact?.address && <p className="cms-body">{settings.contact.address}</p>}{!settings.contact?.email && !settings.contact?.phone && !settings.contact?.address && <p>Die freigegebenen Kontaktdaten werden im Adminbereich ergänzt.</p>}<Link href="/faq">Häufige Fragen</Link></div></aside><section className="card"><h2>Ihre Nachricht</h2><ContactForm/><Link href="/datenschutz">Datenschutzhinweis</Link></section></div></>;
}
