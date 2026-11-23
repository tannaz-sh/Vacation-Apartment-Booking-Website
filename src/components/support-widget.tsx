'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { topicsForPage, type SupportTopic } from '@/lib/support';

export function SupportWidget(props: { topics: SupportTopic[]; unavailable: boolean }) {
  const pathname = usePathname();
  return <SupportPanel key={pathname} {...props} pathname={pathname}/>;
}

function SupportPanel({ topics, unavailable, pathname }: { topics: SupportTopic[]; unavailable: boolean; pathname: string }) {
  const [open, setOpen] = useState(false);
  const [topicId, setTopicId] = useState<string | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const visible = topicsForPage(topics, pathname);
  const selected = visible.find(topic => topic.id === topicId);
  function close() { setOpen(false); trigger.current?.focus(); }

  useEffect(() => {
    if (!open) return;
    heading.current?.focus();
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    }
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !panel.current?.contains(event.target) && !trigger.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside); };
  }, [open, topicId]);

  return <div className="support-widget">
    {open && <div id="support-panel" className="support-panel" role="dialog" aria-labelledby="support-heading" ref={panel}>
      <div className="support-header"><div><span>RF Sauerland Immobilien</span><h2 id="support-heading" tabIndex={-1} ref={heading}>{selected?.title ?? 'Wie können wir helfen?'}</h2></div>
        <button className="support-close" onClick={close} aria-label="Hilfe schließen">×</button></div>
      <div className="support-content">
        {selected ? <><button className="support-back" onClick={() => setTopicId(null)}>Alle Themen</button>
          {selected.section && <p className="support-section">{selected.section}</p>}
          {selected.questions.map((item, index) => <details key={item.id ?? index} className="support-question">
            <summary>{item.question}</summary><p>{item.answer}</p>
          </details>)}</> : <>
          <p>Wählen Sie ein Thema zu dieser Seite.</p>
          {visible.length ? <div className="support-topics">{visible.map(topic => <button key={topic.id} onClick={() => setTopicId(topic.id)}>
            <strong>{topic.title}</strong>{topic.section && <span>{topic.section}</span>}
          </button>)}</div> : <p role="status">{unavailable ? 'Die Antworten sind gerade nicht erreichbar. Bitte versuchen Sie es später erneut.' : 'Für diese Seite sind noch keine Antworten veröffentlicht.'}</p>}
        </>}
      </div>
      <div className="support-footer"><p>Ihre Frage ist noch offen?</p><Link href="/kontakt" onClick={() => setOpen(false)}>Kontakt aufnehmen</Link></div>
    </div>}
    <button ref={trigger} className="support-trigger" aria-label={open ? 'Hilfe schließen' : 'Hilfe öffnen'}
      aria-expanded={open} aria-controls={open ? 'support-panel' : undefined} onClick={() => open ? close() : setOpen(true)}>
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 13v-1a8 8 0 0 1 16 0v1M4 12H3v6h4v-6H4Zm16 0h1v6h-4v-6h3ZM20 18v2h-7"/><path d="M10 20h3"/></svg>
      <span>Hilfe</span>
    </button>
  </div>;
}
