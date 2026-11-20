'use client';
import { useRef } from 'react';
import Link from 'next/link';
export function MobileNavigation({items}: {items: {href:string;label:string}[]}) {
 const menu = useRef<HTMLDetailsElement>(null);
 function close() { if(menu.current) menu.current.open=false; }
 return <details ref={menu} className="mobile-nav"><summary>Menü</summary><nav aria-label="Mobile Navigation">{items.map(item=><Link key={item.href} href={item.href} onClick={close}>{item.label}</Link>)}<Link className="button" href="/buchen" onClick={close}>Aufenthalt planen</Link></nav></details>;
}
