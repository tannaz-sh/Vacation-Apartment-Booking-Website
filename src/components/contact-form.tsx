'use client';
import { useState, type FormEvent } from 'react';
import { contactSchema } from '@/lib/domain';
export function ContactForm() {
  const [status, setStatus] = useState('');
  const [pending, setPending] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({name: data.get('name'), email: data.get('email'), message: data.get('message'), privacy: data.get('privacy') === 'on', website: data.get('website')});
    if (!parsed.success) { setStatus('Bitte prüfen Sie Ihre Angaben und den Datenschutzhinweis.'); return; }
    setPending(true);
    try {
      const result = await fetch('/api/kontakt', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(parsed.data)});
      setStatus(result.status === 400 ? 'Bitte prüfen Sie Ihre Angaben.' : 'Der Nachrichtenversand ist noch nicht verfügbar. Ihre Nachricht wurde nicht gesendet.');
    } catch { setStatus('Verbindung fehlgeschlagen. Ihre Nachricht wurde nicht gesendet.'); }
    finally { setPending(false); }
  }
  return <form className="contact-form" onSubmit={submit}><p className="form-note">Vorschau: Der Versand ist noch nicht eingerichtet. Bitte keine persönlichen Daten eingeben.</p><div className="form-grid"><label>Name<input name="name" autoComplete="name" required minLength={2} maxLength={100}/></label><label>E-Mail<input name="email" type="email" autoComplete="email" required maxLength={254}/></label></div><label>Nachricht<textarea name="message" required minLength={10} maxLength={5000} rows={5}/></label><div className="trap" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" defaultValue=""/></label></div><label className="consent"><input name="privacy" type="checkbox" required/>Ich habe den Datenschutzhinweis gelesen.</label><button disabled={pending}>{pending ? 'Wird geprüft …' : 'Nachricht senden'}</button><p role="status">{status}</p></form>;
}
