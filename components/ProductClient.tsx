'use client';
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { supabase } from '@/lib/supabase';
import { addRecent, getRecent, useWishlist } from '@/lib/store';
import { buildMessage, igProfile } from '@/lib/order';
import { discount, inStock, isLimited, ron, sortSizes, type Product } from '@/lib/types';

function Gallery({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0); const [z, setZ] = useState(false); const [o, setO] = useState('50% 50%');
  const move = (e: React.MouseEvent<HTMLDivElement>) => { const r = e.currentTarget.getBoundingClientRect(); setO(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`); };
  if (!images.length) return <div className="aspect-[4/5] bg-mist grid place-items-center text-ash">No photo yet</div>;
  return (<div>
    <div className={`aspect-[4/5] overflow-hidden bg-mist ${z ? 'cursor-zoom-out' : 'cursor-zoom-in'}`} onMouseMove={z ? move : undefined} onClick={e => { if (!z) move(e); setZ(!z); }}>
      <img src={images[i]} alt={name} className="w-full h-full object-cover transition-transform duration-200" style={{ transform: z ? 'scale(2.2)' : 'none', transformOrigin: o }} /></div>
    {images.length > 1 && <div className="mt-2 flex gap-2 overflow-x-auto">{images.map((src, n) => <button key={src} onClick={() => { setI(n); setZ(false); }} aria-label={`Photo ${n + 1}`} className={`h-20 w-16 shrink-0 border-2 ${n === i ? 'border-black' : 'border-transparent'}`}><img src={src} alt="" className="w-full h-full object-cover" /></button>)}</div>}
    <p className="text-xs text-ash mt-2">Tap or click the photo to zoom.</p></div>);
}

export default function ProductClient({ p, related, instagram }: { p: Product; related: Product[]; instagram: string }) {
  const sizes = Object.keys(p.sizes || {}).sort(sortSizes); const ok = inStock(p); const d = discount(p);
  const [size, setSize] = useState(sizes.length === 1 && sizes[0].toLowerCase() === 'one size' && p.sizes[sizes[0]] > 0 ? sizes[0] : '');
  const [color, setColor] = useState(''); const [qty, setQty] = useState(1); const [err, setErr] = useState(''); const [modal, setModal] = useState(false); const [recent, setRecent] = useState<Product[]>([]);
  const { ids, toggle } = useWishlist(); const saved = ids.includes(p.id);
  const max = size ? Math.max(1, p.sizes[size] || 1) : 10;
  useEffect(() => {
    const prev = getRecent().filter(x => x !== p.id).slice(0, 4); addRecent(p.id);
    if (prev.length && supabase) supabase.from('products').select('*').in('id', prev).eq('published', true).then(({ data }) => setRecent(((data as Product[]) || []).sort((a, b) => prev.indexOf(a.id) - prev.indexOf(b.id))));
  }, [p.id]);
  const msg = buildMessage(p, size, qty, color);
  const buy = () => {
    if (!ok) return;
    if (sizes.length && !size) { setErr('Select a size first.'); return; }
    if (p.colors.length && !color) { setErr('Select a colour first.'); return; }
    setErr(''); setModal(true);
  };
  const send = () => {
    try { navigator.clipboard?.writeText(msg).catch(() => {}); } catch {}
    if (instagram) window.open(igProfile(instagram), '_blank', 'noopener');
  };
  return (<div className="px-4 md:px-8 py-8">
    <div className="grid md:grid-cols-2 gap-8 md:gap-14">
      <Gallery images={p.images} name={p.name} />
      <div className="md:sticky md:top-24 self-start">
        <p className="text-ash">{p.brand}</p><h1 className="disp text-3xl md:text-5xl mt-1">{p.name}</h1>
        <p className="mt-4 text-2xl font-bold">{ron(p.price)}{d > 0 && <><span className="ml-3 text-ash line-through text-lg font-normal">{ron(p.original_price!)}</span><span className="ml-3 bg-accent text-white text-sm px-2 py-1 align-middle">−{d}%</span></>}</p>
        <p className={`mt-2 text-sm font-semibold ${ok ? '' : 'text-ash'}`}>{!ok ? 'Sold out' : isLimited(p) ? 'Limited stock: only a few left' : 'In stock'}</p>
        {sizes.length > 0 && <div className="mt-6"><p className="font-semibold mb-2">Size</p><div className="flex flex-wrap gap-2">{sizes.map(s => <button key={s} className="chip" aria-pressed={size === s} disabled={!ok || !(p.sizes[s] > 0)} onClick={() => { setSize(s); setQty(1); setErr(''); }}>{s}</button>)}</div></div>}
        {p.colors.length > 0 && <div className="mt-6"><p className="font-semibold mb-2">Colour</p><div className="flex flex-wrap gap-2">{p.colors.map(c => <button key={c} className="chip" aria-pressed={color === c} onClick={() => { setColor(c); setErr(''); }}>{c}</button>)}</div></div>}
        <div className="mt-6"><p className="font-semibold mb-2">Quantity</p><div className="inline-flex border-[1.5px] border-line items-center">
          <button className="h-11 w-11 text-xl" aria-label="Decrease" onClick={() => setQty(Math.max(1, qty - 1))}>−</button><span className="w-10 text-center font-semibold" aria-live="polite">{qty}</span><button className="h-11 w-11 text-xl" aria-label="Increase" onClick={() => setQty(Math.min(max, qty + 1))}>+</button></div>
          {size && <span className="ml-3 text-sm text-ash">{p.sizes[size]} available</span>}</div>
        {err && <p role="alert" className="mt-4 text-accent font-semibold">{err}</p>}
        <div className="mt-6 flex gap-3"><button className="btn flex-1 text-lg" disabled={!ok} onClick={buy}>{ok ? 'Buy now' : 'Sold out'}</button>
          <button className="btn btn-line" aria-pressed={saved} onClick={() => toggle(p.id)}>{saved ? '♥ Saved' : '♡ Save'}</button></div>
        <p className="mt-3 text-sm text-ash">Orders are confirmed in an Instagram chat. Nothing is charged on this site.</p>
        {p.description && <div className="prose-s mt-8 border-t border-line pt-6"><p>{p.description}</p></div>}
      </div>
    </div>
    {related.length > 0 && <section className="mt-20"><h2 className="disp text-2xl md:text-4xl mb-6">You may also like</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8">{related.map(r => <ProductCard key={r.id} p={r} />)}</div></section>}
    {recent.length > 0 && <section className="mt-20"><h2 className="disp text-2xl md:text-4xl mb-6">Recently viewed</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8">{recent.map(r => <ProductCard key={r.id} p={r} />)}</div></section>}
    {modal && <div className="fixed inset-0 z-50 bg-black/60 grid place-items-end md:place-items-center" onClick={() => setModal(false)}>
      <div role="dialog" aria-modal="true" aria-label="Send order on Instagram" className="bg-white w-full md:max-w-lg p-6 max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <h2 className="disp text-2xl">Send your order</h2>
        <p className="mt-2 text-sm text-ash">Your order is not sent yet. Copy the message, open our Instagram chat, paste it and press send.</p>
        <textarea readOnly className="field mt-4 h-52 font-mono text-sm" value={msg} onFocus={e => e.currentTarget.select()} aria-label="Order message" />
        {instagram ? <div className="mt-4 grid gap-2"><button className="btn" onClick={send}>Copy message & open Instagram</button>
          <button className="btn btn-line" onClick={() => navigator.clipboard?.writeText(msg).catch(() => {})}>Copy message only</button></div>
          : <p className="mt-4 text-accent font-semibold">Instagram username is not set yet. Copy the message and contact the store directly.</p>}
        <button className="mt-3 w-full py-3 font-semibold underline" onClick={() => setModal(false)}>Close</button></div></div>}
  </div>);
}
