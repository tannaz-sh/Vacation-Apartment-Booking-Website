import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { MobileNavigation } from '@/components/mobile-navigation';
export const metadata: Metadata = {
  title: { default: 'RF Sauerland Immobilien | Ferienwohnungen in Winterberg', template: '%s | RF Sauerland Immobilien' },
  description: 'Ferienwohnungen und kurze Auszeiten in Winterberg im Sauerland.',
  robots: { index: process.env.SITE_INDEXABLE === 'true', follow: process.env.SITE_INDEXABLE === 'true' },
};
const navigation = [{href:'/ferienwohnungen',label:'Ferienwohnungen'},{href:'/ueber-uns',label:'Über uns'},{href:'/faq',label:'FAQ'},{href:'/kontakt',label:'Kontakt'}];
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="de"><body><a className="skip" href="#inhalt">Zum Inhalt</a>
    <div className="notice">Entwicklungsvorschau · Inhalte noch nicht freigegeben · Keine Buchung möglich</div>
    <header className="site-header"><div className="container header-inner"><Link className="brand" href="/"><span className="brand-name">RF Sauerland Immobilien</span><small>WINTERBERG · HOCHSAUERLANDKREIS</small></Link><nav className="desktop-nav" aria-label="Hauptnavigation">{navigation.map(n=><Link key={n.href} href={n.href}>{n.label}</Link>)}</nav><Link className="button header-action" href="/buchen">Aufenthalt planen</Link><MobileNavigation items={navigation}/></div></header>
    <main className="page-content" id="inhalt">{children}</main>
    <footer className="site-footer"><div className="container"><div className="footer-grid"><div className="footer-brand"><span className="brand-name">RF Sauerland Immobilien</span><p>Ferienwohnungen und kleine Auszeiten.<br/>Winterberg · Sauerland</p></div><div><div className="footer-label">Ihr Aufenthalt</div><nav aria-label="Unterkünfte"><Link href="/ferienwohnungen">Ferienwohnungen</Link><Link href="/buchen">Verfügbarkeit & Buchung</Link><Link href="/faq">Häufige Fragen</Link></nav></div><div><div className="footer-label">Persönlich & regional</div><nav aria-label="Über unsere Gastgeber"><Link href="/ueber-uns">Über uns</Link><Link href="/kontakt">Kontakt aufnehmen</Link></nav></div></div><div className="footer-bottom"><nav aria-label="Rechtliche Informationen"><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/buchungsbedingungen">Buchungsbedingungen</Link></nav><p>© RF Sauerland Immobilien</p></div></div></footer>
  </body></html>;
}
