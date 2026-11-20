'use client';
import { useState } from 'react';
import { searchFaq, type Faq } from '@/lib/domain';
export function FaqSearch({entries}: {entries: Faq[]}) {
  const [query, setQuery] = useState('');
  const results = searchFaq(entries, query);
  return <><label>Fragen durchsuchen<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label><div aria-live="polite">{results.length ? results.map(entry => <details key={entry.question}><summary>{entry.question}</summary><p>{entry.answer}</p></details>) : <p>Hierzu liegt noch keine freigegebene Antwort vor. Bitte wenden Sie sich an uns.</p>}</div></>;
}
