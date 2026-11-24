import { RootPage } from '@payloadcms/next/views';
import Link from 'next/link';
import config from '@/payload.config';
import { cmsConfigured } from '@/lib/cms-settings';
import { importMap } from '../importMap';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Inhaltsverwaltung', robots: { index: false, follow: false } };
type Props = { params: Promise<{ segments: string[] }>; searchParams: Promise<Record<string, string | string[]>> };
export default function AdminPage(props: Props) {
  if (!cmsConfigured()) return <main style={{ maxWidth: 640, margin: '4rem auto', padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
    <h1>Verwaltung noch nicht eingerichtet</h1><p>Der geschützte Verwaltungsbereich wird vor der Übergabe eingerichtet.</p><Link href="/">Zur Website</Link>
  </main>;
  return RootPage({ ...props, config, importMap });
}
