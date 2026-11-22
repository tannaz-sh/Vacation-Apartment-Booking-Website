import Link from 'next/link';
import { FaqSearch } from '@/components/faq-search';
import { CmsSections } from '@/components/cms-sections';
import { getApprovedFaqs, getPage, getPageMetadata } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const generateMetadata = () => getPageMetadata('faq', 'Häufige Fragen');
export default async function Faq() {
  const [entries, page] = await Promise.all([getApprovedFaqs(), getPage('faq')]);
  return <><div className="breadcrumbs"><Link href="/">Startseite</Link> / Häufige Fragen</div><div className="center"><div className="eyebrow">{page?.eyebrow ?? 'GUT ZU WISSEN'}</div><h1>{page?.title ?? 'Häufige Fragen'}</h1><p className="lead">{page?.intro ?? 'Damit Sie Ihre Auszeit in Ruhe planen können.'}</p></div><CmsSections sections={page?.sections}/><div className="faq-panel"><p>Die Suche zeigt ausschließlich veröffentlichte Antworten.</p><FaqSearch entries={entries}/><div className="status-panel"><h2>Noch eine Frage?</h2><p>Wenden Sie sich mit Ihrer Frage zum Aufenthalt an uns.</p><Link className="button" href="/kontakt">Kontakt aufnehmen</Link></div></div></>;
}
