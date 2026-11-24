import { notFound } from 'next/navigation';
const titles: Record<string,string> = { impressum:'Impressum', datenschutz:'Datenschutzerklärung', buchungsbedingungen:'Buchungs- und Stornierungsbedingungen' };
export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(titles).map(legal => ({ legal })); }
export async function generateMetadata({params}: {params: Promise<{legal:string}>}) { return {title: titles[(await params).legal] ?? 'Seite nicht gefunden', robots:{index:false,follow:false}}; }
export default async function Legal({params}: {params: Promise<{legal:string}>}) {
  const title = titles[(await params).legal]; if (!title) notFound();
  return <><h1>{title}</h1><p>Entwurf – der freigegebene Text des Betreibers steht noch aus. Diese Vorschau ist nicht zur Veröffentlichung bestimmt.</p></>;
}
