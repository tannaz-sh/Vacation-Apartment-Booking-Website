'use client';
export default function ErrorPage({reset}: {reset:()=>void}) { return <><h1>Etwas ist schiefgelaufen</h1><p>Bitte versuchen Sie es erneut.</p><button onClick={reset}>Erneut versuchen</button></>; }
