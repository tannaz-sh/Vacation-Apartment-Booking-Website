import Link from 'next/link';
import { CmsSections } from '@/components/cms-sections';
import { getPage, getPageMetadata } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const generateMetadata = () => getPageMetadata('ueber-uns', 'Über uns');
export default async function About() {
  const page = await getPage('ueber-uns');
  return <><div className="breadcrumbs"><Link href="/">Startseite</Link> / Über uns</div><div className="eyebrow">{page?.eyebrow ?? 'RF SAUERLAND IMMOBILIEN'}</div><h1>{page?.title ?? 'Persönlich. Regional. Zeit für Ihre Auszeit.'}</h1><p className="lead">{page?.intro ?? 'Ferienwohnungen für kurze Aufenthalte in Winterberg im Sauerland.'}</p><CmsSections sections={page?.sections}/>{!page && <p>Die persönliche Vorstellung wird im Adminbereich vorbereitet.</p>}</>;
}
