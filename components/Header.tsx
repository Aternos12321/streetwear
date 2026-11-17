'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useWishlist } from '@/lib/store';
const links: [string,string][] = [['/shop','All'],['/shop?category=shoes','Shoes'],['/shop?category=clothing','Clothing'],['/shop?category=accessories','Accessories']];
export default function Header({ name }: { name: string }) {
  const [open, setOpen] = useState(false); const { ids } = useWishlist();
  return (<header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
    <div className="flex items-center justify-between h-16 px-4 md:px-8">
      <Link href="/" className="disp text-xl" onClick={() => setOpen(false)}>{name}</Link>
      <nav className="hidden md:flex gap-8 font-semibold">{links.map(([h,l]) => <Link key={l} href={h} className="hover:text-accent">{l}</Link>)}</nav>
      <div className="flex items-center gap-4">
        <Link href="/wishlist" className="font-semibold hover:text-accent">Saved{ids.length ? ` (${ids.length})` : ''}</Link>
        <button className="md:hidden font-semibold" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
      </div>
    </div>
    {open && <nav className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-black text-white p-6 flex flex-col gap-5 overflow-auto">
      {links.map(([h,l]) => <Link key={l} href={h} onClick={() => setOpen(false)} className="disp text-4xl">{l}</Link>)}
      <Link href="/info/delivery" onClick={() => setOpen(false)} className="mt-auto text-white/70">Delivery & returns</Link>
    </nav>}
  </header>);
}
