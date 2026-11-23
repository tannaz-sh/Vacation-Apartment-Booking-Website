'use client';

import Script from 'next/script';
import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

declare global {
  interface Window {
    BookingToolIframe?: { initialize: (options: { url: string; baseUrl: string; target: string }) => void };
  }
}

export function BookingEmbed({ url }: { url: string }) {
  const id = `smoobu-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const container = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const [active, setActive] = useState(false);
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading');

  const initialize = useCallback(() => {
    if (initialized.current || !window.BookingToolIframe || !container.current) return;
    initialized.current = true;
    try { window.BookingToolIframe.initialize({ url, baseUrl: 'https://login.smoobu.com', target: `#${id}` }); }
    catch { setState('failed'); }
  }, [id, url]);

  useEffect(() => {
    if (!active || !container.current) return;
    const node = container.current;
    let frame: HTMLIFrameElement | null = null;
    const timeout = window.setTimeout(() => setState('failed'), 20000);
    const loaded = () => { window.clearTimeout(timeout); setState('ready'); };
    const inspect = () => {
      const current = node.querySelector('iframe');
      if (!current || current === frame) return;
      frame = current;
      frame.title = 'Smoobu – Unterkunft auswählen und buchen';
      frame.addEventListener('load', loaded);
    };
    const observer = new MutationObserver(inspect);
    observer.observe(node, { childList: true, subtree: true });
    inspect();
    return () => { observer.disconnect(); window.clearTimeout(timeout); frame?.removeEventListener('load', loaded); };
  }, [active]);

  return <section className="booking-embed" aria-label="Buchungsformular">
    {!active ? <div className="status-panel"><h2>Ihre Unterkunft direkt hier buchen</h2>
      <p>Das Buchungsformular wird von Smoobu bereitgestellt. Beim Laden wird eine Verbindung zu Smoobu und den für das Formular benötigten Diensten hergestellt.</p>
      <button onClick={() => setActive(true)}>Buchungsformular laden</button><p><Link href="/datenschutz">Datenschutzhinweise</Link></p>
    </div> : <>
      {state === 'loading' && <p role="status">Das Buchungsformular wird geladen …</p>}
      {state === 'failed' && <div role="status" className="status-panel"><h2>Buchungsformular nicht erreichbar</h2>
        <p>Bitte laden Sie die Seite erneut oder nehmen Sie Kontakt auf. Es wurde durch das Laden des Formulars keine Reservierung vorgenommen.</p>
        <button onClick={() => window.location.reload()}>Erneut versuchen</button> <Link href="/kontakt">Kontakt aufnehmen</Link>
      </div>}
      <div id={id} ref={container} className="booking-frame-container"/>
      <Script src="https://login.smoobu.com/js/Settings/BookingToolIframe.js" strategy="afterInteractive"
        onReady={initialize} onError={() => setState('failed')}/>
    </>}
  </section>;
}
