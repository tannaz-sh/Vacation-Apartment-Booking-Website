import { getPayload } from 'payload';
import config from '../src/payload.config';
import type { Page } from '../src/payload-types';

const payload = await getPayload({ config });
const pages: Array<Pick<Page, 'slug' | 'eyebrow' | 'title' | 'intro'>> = [
  { slug: 'startseite', eyebrow: 'HOCHSAUERLANDKREIS · WINTERBERG', title: 'Ferienwohnungen im Sauerland', intro: 'Zeit für Ihre Auszeit in Winterberg und im Sauerland.' },
  { slug: 'ferienwohnungen', eyebrow: 'FERIENDOMIZILE IM SAUERLAND', title: 'Ferienwohnungen in Winterberg', intro: 'Finden Sie die passende Unterkunft für Ihre Auszeit.' },
  { slug: 'buchen', eyebrow: 'IHRE REISE BEGINNT HIER', title: 'Verfügbarkeit & Buchung', intro: 'Reisedaten, verbindliche Preise und Bedingungen werden im Smoobu-Buchungsportal angezeigt.' },
  { slug: 'faq', eyebrow: 'GUT ZU WISSEN', title: 'Häufige Fragen', intro: 'Veröffentlichte Antworten für die Planung Ihres Aufenthalts.' },
  { slug: 'ueber-uns', eyebrow: 'RF SAUERLAND IMMOBILIEN', title: 'Über uns', intro: 'Die freigegebene Vorstellung der Gastgeber wird hier ergänzt.' },
  { slug: 'kontakt', eyebrow: 'WINTERBERG & SAUERLAND', title: 'Kontakt aufnehmen', intro: 'Ihre Fragen zu einer Ferienwohnung oder Ihrem Aufenthalt.' },
  { slug: 'impressum', title: 'Impressum', intro: 'Entwurf: Betreiberangaben vor Veröffentlichung rechtlich prüfen.' },
  { slug: 'datenschutz', title: 'Datenschutzerklärung', intro: 'Entwurf: Datenschutzhinweise vor Veröffentlichung rechtlich prüfen.' },
  { slug: 'buchungsbedingungen', title: 'Buchungs- und Stornierungsbedingungen', intro: 'Entwurf: Nur bestätigte Bedingungen des Betreibers und Smoobu veröffentlichen.' },
];

let created = 0;
for (const page of pages) {
  const existing = await payload.find({ collection: 'pages', overrideAccess: true, limit: 1, where: { slug: { equals: page.slug } } });
  if (!existing.docs.length) {
    await payload.create({ collection: 'pages', overrideAccess: true, draft: true, data: { ...page, sections: [], seo: {} } });
    created += 1;
  }
}
console.log(`CMS seed complete: ${created} draft page(s) created; existing pages were preserved.`);
await payload.destroy();
process.exit(0);
