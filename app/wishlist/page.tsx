'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { useWishlist } from '@/lib/store';
import type { Product } from '@/lib/types';
export default function Wishlist() {
  const { ids } = useWishlist(); const [items, setItems] = useState<Product[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { if (!supabase) { setLoading(false); return; } if (!ids.length) { setItems([]); setLoading(false); return; }
    supabase.from('products').select('*').in('id', ids).eq('published', true).then(({ data }) => { setItems((data as Product[]) || []); setLoading(false); }); }, [ids]);
  return (<div className="px-4 md:px-8 py-10"><h1 className="disp text-4xl md:text-7xl">Saved</h1>
    {loading ? <p className="mt-8 text-ash">Loading…</p> : items.length ? <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8">{items.map(p => <ProductCard key={p.id} p={p} />)}</div>
      : <div className="py-20"><p className="text-ash">Nothing saved yet. Tap the heart on any product to keep it here.</p><Link href="/shop" className="btn mt-5">Browse products</Link></div>}</div>);
}
