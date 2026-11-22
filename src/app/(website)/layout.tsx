import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { MobileNavigation } from '@/components/mobile-navigation';
import { getSiteSettings } from '@/lib/content';
export async function generateMetadata(): Promise<Metadata> { const settings = await getSiteSettings(); return {
  title: { default: settings.defaultSeo.title, template: `%s | ${settings.businessName}` },
  description: settings.defaultSeo.description,
  robots: { index: process.env.SITE_INDEXABLE === 'true', follow: process.env.SITE_INDEXABLE === 'true' },
}; }
export default async function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  const settings = await getSiteSettings();
  const navigation = settings.navigation?.map(item => ({ href: item.url, label: item.label })) ?? [];
  return <html lang="de"><body><a className="skip" href="#inhalt">Zum Inhalt</a>
    {settings.previewNotice && <div className="notice">{settings.previewNotice}</div>}
    <header className="site-header"><div className="container header-inner"><Link className="brand" href="/"><span className="brand-name">{settings.businessName}</span><small>{settings.locationLine}</small></Link><nav className="desktop-nav" aria-label="Hauptnavigation">{navigation.map(n=><Link key={n.href} href={n.href}>{n.label}</Link>)}</nav>{settings.headerCta?.label && settings.headerCta.url && <Link className="button header-action" href={settings.headerCta.url}>{settings.headerCta.label}</Link>}<MobileNavigation items={navigation}/></div></header>
    <main className="page-content" id="inhalt">{children}</main>
    <footer className="site-footer"><div className="container"><div className="footer-grid"><div className="footer-brand"><span className="brand-name">{settings.businessName}</span><p className="cms-body">{settings.footerText}</p>{settings.contact?.email && <p><a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a></p>}</div>{settings.footerColumns?.map(column => <div key={column.id}><div className="footer-label">{column.title}</div><nav aria-label={column.title}>{column.links?.map(item => <Link key={item.id} href={item.url}>{item.label}</Link>)}</nav></div>)}</div><div className="footer-bottom"><nav aria-label="Rechtliche Informationen">{settings.legalLinks?.map(item => <Link key={item.id} href={item.url}>{item.label}</Link>)}</nav><p>© {settings.businessName}</p></div></div></footer>
  </body></html>;
}
