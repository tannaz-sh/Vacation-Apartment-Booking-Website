import type { ServerFunctionClient } from 'payload';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import '@payloadcms/next/css';
import config from '@/payload.config';
import { cmsConfigured } from '@/lib/cms-settings';
import { importMap } from './admin/importMap';

export const metadata = { robots: { index: false, follow: false } };
const serverFunction: ServerFunctionClient = async args => {
  'use server';
  if (!cmsConfigured()) throw new Error('Administration unavailable');
  return handleServerFunctions({ ...args, config, importMap });
};
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!cmsConfigured()) return <html lang="de"><body>{children}</body></html>;
  return <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>{children}</RootLayout>;
}
