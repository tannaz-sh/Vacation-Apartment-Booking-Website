import Image from 'next/image';
import Link from 'next/link';
import type { Page, Media } from '@/payload-types';

function approvedImage(value: number | Media | null | undefined): Media | null {
  return typeof value === 'object' && value?.url && value.visibility === 'public' ? value : null;
}
function SectionLink({ label, url, className }: { label?: string | null; url?: string | null; className?: string }) {
  return label && url ? <Link className={className} href={url}>{label}</Link> : null;
}
export function CmsSections({ sections }: { sections: Page['sections'] }) {
  if (!sections?.length) return null;
  return <>{sections.map(section => {
    const theme = section.theme === 'dark' ? 'dark-section' : section.theme === 'soft' ? 'soft-section' : '';
    const image = approvedImage(section.image);
    if (section.layout === 'cards') return <section className={`section ${theme}`} key={section.id}><div className="container"><div className="eyebrow">{section.eyebrow}</div><h2>{section.title}</h2><p className="lead cms-body">{section.body}</p><div className="grid">{section.items?.map(item => <article className="card" key={item.id}><h3>{item.title}</h3><p className="cms-body">{item.body}</p><SectionLink label={item.linkLabel} url={item.linkUrl}/></article>)}</div><SectionLink className="button" label={section.linkLabel} url={section.linkUrl}/></div></section>;
    if (section.layout === 'imageText') return <section className={`section ${theme}`} key={section.id}><div className="container feature-panel">{image ? <Image src={image.url!} alt={image.alt} width={1200} height={900} unoptimized/> : <div className="image-pending"><span>Bild folgt nach Freigabe</span></div>}<div className="feature-copy"><div className="eyebrow">{section.eyebrow}</div><h2>{section.title}</h2><p className="cms-body">{section.body}</p><SectionLink className="button" label={section.linkLabel} url={section.linkUrl}/></div></div></section>;
    if (section.layout === 'cta') return <section className={`section ${theme || 'dark-section'}`} key={section.id}><div className="container center"><div className="eyebrow">{section.eyebrow}</div><h2>{section.title}</h2><p className="lead cms-body">{section.body}</p><SectionLink className="button button-light" label={section.linkLabel} url={section.linkUrl}/></div></section>;
    return <section className={`section ${theme}`} key={section.id}><div className="container"><div className="eyebrow">{section.eyebrow}</div><h2>{section.title}</h2><p className="lead cms-body">{section.body}</p><SectionLink className="button" label={section.linkLabel} url={section.linkUrl}/></div></section>;
  })}</>;
}
