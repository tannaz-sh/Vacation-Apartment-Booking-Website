import { notFound } from 'next/navigation';
import { getPage, getPageMetadata } from '@/lib/content';
import { CmsSections } from '@/components/cms-sections';
const titles: Record<string,string> = { impressum:'Impressum', datenschutz:'Datenschutzerklärung', buchungsbedingungen:'Buchungs- und Stornierungsbedingungen' };
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(titles).map(legal => ({ legal })); }
export async function generateMetadata({params}: {params: Promise<{legal:string}>}) { const legal = (await params).legal; if (!(legal in titles)) return { title: 'Seite nicht gefunden' }; return { ...(await getPageMetadata(legal as 'impressum' | 'datenschutz' | 'buchungsbedingungen', titles[legal])), robots:{index:false,follow:false} }; }
export const dynamic = 'force-dynamic';
export default async function Legal({params}: {params: Promise<{legal:string}>}) {
  const legal = (await params).legal; const title = titles[legal]; if (!title) notFound();
  const page = await getPage(legal as 'impressum' | 'datenschutz' | 'buchungsbedingungen');
  if (!page) return <><h1>{title}</h1><p>Entwurf – der freigegebene Text des Betreibers steht noch aus. Diese Vorschau ist nicht zur Veröffentlichung bestimmt.</p></>;
  return <><div className="eyebrow">{page.eyebrow}</div><h1>{page.title}</h1>{page.intro && <p className="lead">{page.intro}</p>}<CmsSections sections={page.sections}/></>;
}
