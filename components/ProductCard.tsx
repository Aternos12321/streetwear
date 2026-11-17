'use client';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { discount, inStock, isLimited, ron, sizeList } from '@/lib/types';
import { useWishlist } from '@/lib/store';
export default function ProductCard({ p }: { p: Product }) {
  const { ids, toggle } = useWishlist(); const saved = ids.includes(p.id); const d = discount(p); const ok = inStock(p); const sizes = sizeList(p);
  return (<div className="group relative">
    <Link href={`/product/${p.slug}`} className="block">
      <div className="relative aspect-[4/5] bg-mist overflow-hidden">
        {p.images[0] ? <img src={p.images[0]} alt={p.name} loading="lazy" className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${p.images[1] ? 'group-hover:opacity-0' : ''} ${ok ? '' : 'opacity-50'}`} /> : <div className="absolute inset-0 grid place-items-center text-ash text-sm">No photo</div>}
        {p.images[1] && <img src={p.images[1]} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
        <div className="absolute top-2 left-2 flex flex-col gap-1 text-xs font-bold">
          {!ok && <span className="bg-black text-white px-2 py-1">Sold out</span>}
          {ok && p.is_new && <span className="bg-white px-2 py-1">New</span>}
          {d > 0 && ok && <span className="bg-accent text-white px-2 py-1">Sale −{d}%</span>}
          {isLimited(p) && <span className="bg-white text-accent px-2 py-1">Limited stock</span>}
        </div>
      </div>
      <div className="pt-3"><p className="text-sm text-ash">{p.brand}</p><p className="font-semibold leading-snug">{p.name}</p>
        <p className="mt-1"><span className="font-bold">{ron(p.price)}</span>{d > 0 && <span className="ml-2 text-ash line-through text-sm">{ron(p.original_price!)}</span>}</p>
        <p className="text-xs text-ash mt-1 truncate">{ok ? `Sizes: ${sizes.join(', ')}` : 'Currently unavailable'}</p></div>
    </Link>
    <button onClick={() => toggle(p.id)} aria-pressed={saved} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'} className="absolute top-2 right-2 h-9 w-9 bg-white grid place-items-center text-lg">{saved ? '♥' : '♡'}</button>
  </div>);
}
