import Link from 'next/link';
import { FaqSearch } from '@/components/faq-search';
import { getApprovedFaqs } from '@/lib/content';
export const metadata = { title: 'Häufige Fragen' };
export const dynamic = 'force-dynamic';
export default async function Faq() { const approvedFaqs = await getApprovedFaqs(); return <><div className="breadcrumbs"><Link href="/">Startseite</Link> / Häufige Fragen</div><div className="center"><div className="eyebrow">GUT ZU WISSEN</div><h1>Häufige Fragen</h1><p className="lead">Damit Sie Ihre Auszeit in Ruhe planen können.</p></div><div className="faq-panel"><p>Unser FAQ-Helfer durchsucht ausschließlich freigegebene Antworten.</p><FaqSearch entries={approvedFaqs}/><div className="status-panel"><h2>Noch eine Frage?</h2><p>Wenden Sie sich mit Ihrer Frage zum Aufenthalt an uns.</p><Link className="button" href="/kontakt">Kontakt aufnehmen</Link></div></div></>; }
