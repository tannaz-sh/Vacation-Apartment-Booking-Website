import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getPayload } from 'payload';
import config from '@payload-config';

export const metadata = { title: 'Vorschau', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function Preview({ params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
  const payload = await getPayload({ config });
  const auth = await payload.auth({ headers: await headers() });
  if (!auth.user) redirect(`/admin/login?redirect=${encodeURIComponent(`/vorschau/${collection}/${id}`)}`);
  const numericID = Number(id);
  if (!Number.isInteger(numericID) || !['apartments', 'pages'].includes(collection)) notFound();
  if (collection === 'apartments') {
    const apartment = await payload.findByID({ collection: 'apartments', id: numericID, draft: true, overrideAccess: false, user: auth.user, depth: 1 });
    return <><p role="note">Entwurfsvorschau · nicht öffentlich</p><h1>{apartment.title}</h1><p>{apartment.description}</p><p>Bis zu {apartment.capacity} Gäste · {apartment.bedrooms} Schlafzimmer</p><ul>{apartment.amenities?.map(item => <li key={item.id}>{item.label}</li>)}</ul></>;
  }
  const page = await payload.findByID({ collection: 'pages', id: numericID, draft: true, overrideAccess: false, user: auth.user, depth: 1 });
  return <><p role="note">Entwurfsvorschau · nicht öffentlich</p><h1>{page.title}</h1>{page.intro && <p className="lead">{page.intro}</p>}{page.sections?.map(section => <section key={section.id}><h2>{section.title}</h2><p>{section.body}</p></section>)}</>;
}
