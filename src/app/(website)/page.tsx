import Link from 'next/link';
import { CmsSections } from '@/components/cms-sections';
import { getPage, getPageMetadata } from '@/lib/content';

export const dynamic = 'force-dynamic';
export const generateMetadata = () => getPageMetadata('startseite', 'Startseite');

function SearchPanel() {
  return <div className="container"><form action="/ferienwohnungen" className="search-panel"><div className="panel-top"><span>Ihre Auszeit beginnt hier</span><span>Winterberg & Sauerland</span></div><div className="search-fields"><label><span id="home-guests-label">Gäste</span><select aria-labelledby="home-guests-label" name="gaeste" defaultValue="1"><option value="1">1 Gast</option><option value="2">2 Gäste</option><option value="3">3 Gäste</option><option value="4">4 Gäste</option><option value="5">5 Gäste</option><option value="6">6 Gäste</option></select></label><label><span id="home-amenity-label">Ausstattung</span><select aria-labelledby="home-amenity-label" name="ausstattung"><option value="">Alle Ausstattungen</option><option>WLAN</option><option>Küche</option><option>Balkon</option></select></label><button>Unterkünfte finden</button></div><p className="search-note">Reisedaten, Verfügbarkeit und verbindliche Preise prüfen Sie anschließend im Buchungsportal.</p></form></div>;
}
export default async function Home() {
  const page = await getPage('startseite');
  return <div className="home">
    <section className="hero"><div className="container"><div className="eyebrow">{page?.eyebrow ?? 'HOCHSAUERLANDKREIS · WINTERBERG'}</div><h1>{page?.title ?? <>Ferienwohnungen im Sauerland.<em>Zeit für Ihre Auszeit.</em></>}</h1><p>{page?.intro ?? 'Ein paar Tage zur Ruhe kommen. Die Natur entdecken. Und einen Ort finden, an dem sich Ihr Urlaub zu Hause anfühlt.'}</p><div className="actions"><Link className="button button-light" href="/ferienwohnungen">Ferienwohnungen entdecken</Link><Link className="button" href="/buchen">Aufenthalt planen</Link></div></div></section>
    <SearchPanel/>
    {page ? <CmsSections sections={page.sections}/> : <>
      <section className="section container"><div className="section-heading"><div><div className="eyebrow">URLAUB IN WINTERBERG</div><h2>Ein Ort zum Ankommen.<br/>Raum zum Durchatmen.</h2></div><p>Die bearbeitbaren Inhalte werden im Adminbereich vorbereitet.</p></div><div className="grid"><article className="card"><h3>Ferienwohnungen</h3><p>Unterkünfte, Ausstattung und Bilder werden über Payload verwaltet.</p><Link href="/ferienwohnungen">Unterkünfte entdecken</Link></article><article className="card"><h3>Häufige Fragen</h3><p>Nur veröffentlichte Antworten erscheinen auf der Website.</p><Link href="/faq">Antworten finden</Link></article><article className="card"><h3>Kontakt</h3><p>Kontakttexte und Angaben können im Adminbereich gepflegt werden.</p><Link href="/kontakt">Kontakt aufnehmen</Link></article></div></section>
    </>}
  </div>;
}
