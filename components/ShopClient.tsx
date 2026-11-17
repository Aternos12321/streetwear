'use client';
import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import { CATEGORIES, inStock, sizeList, sortSizes, type Product } from '@/lib/types';
export default function ShopClient({ products, configured, initialCategory, initialSort }: { products: Product[]; configured: boolean; initialCategory: string; initialSort: string }) {
  const [q, setQ] = useState(''); const [cat, setCat] = useState(initialCategory); const [brand, setBrand] = useState(''); const [size, setSize] = useState('');
  const [sort, setSort] = useState(initialSort); const [open, setOpen] = useState(false);
  const maxP = Math.max(100, ...products.map(p => Math.ceil(p.price))); const [price, setPrice] = useState(0); const cap = price || maxP;
  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort(), [products]);
  const sizes = useMemo(() => Array.from(new Set(products.flatMap(sizeList))).sort(sortSizes), [products]);
  const list = useMemo(() => {
    const r = products.filter(p => (!cat || p.category === cat) && (!brand || p.brand === brand) && p.price <= cap && (!size || sizeList(p).includes(size)) && (`${p.name} ${p.brand}`.toLowerCase().includes(q.toLowerCase().trim())));
    const by: Record<string, (a: Product, b: Product) => number> = { newest: (a, b) => +new Date(b.created_at) - +new Date(a.created_at), low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, popular: (a, b) => (b.popularity + (b.is_best_seller ? 100 : 0)) - (a.popularity + (a.is_best_seller ? 100 : 0)) };
    return r.sort((a, b) => (Number(inStock(b)) - Number(inStock(a))) || (by[sort] || by.newest)(a, b));
  }, [products, q, cat, brand, size, cap, sort]);
  const reset = () => { setQ(''); setCat(''); setBrand(''); setSize(''); setPrice(0); };
  return (<div className="px-4 md:px-8 py-10">
    <h1 className="disp text-4xl md:text-7xl">{cat ? CATEGORIES.find(c => c[0] === cat)?.[1] : 'All products'}</h1>
    <div className="mt-6 flex flex-col md:flex-row gap-3">
      <input className="field md:max-w-sm" type="search" placeholder="Search by name or brand" value={q} onChange={e => setQ(e.target.value)} aria-label="Search products" />
      <select className="field md:max-w-[14rem]" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort"><option value="newest">Newest</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="popular">Most popular</option></select>
      <button className="btn btn-line md:hidden" onClick={() => setOpen(!open)}>{open ? 'Hide filters' : 'Filters'}</button>
    </div>
    <div className={`${open ? 'grid' : 'hidden'} md:grid mt-4 gap-3 md:grid-cols-5`}>
      <select className="field" value={cat} onChange={e => setCat(e.target.value)} aria-label="Category"><option value="">All categories</option>{CATEGORIES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
      <select className="field" value={brand} onChange={e => setBrand(e.target.value)} aria-label="Brand"><option value="">All brands</option>{brands.map(b => <option key={b}>{b}</option>)}</select>
      <select className="field" value={size} onChange={e => setSize(e.target.value)} aria-label="Size"><option value="">Any size</option>{sizes.map(s => <option key={s}>{s}</option>)}</select>
      <label className="text-sm flex flex-col justify-center">Up to {cap} RON<input type="range" min={0} max={maxP} step={10} value={cap} onChange={e => setPrice(+e.target.value)} className="accent-black" /></label>
      <button className="btn btn-line" onClick={reset}>Clear filters</button>
    </div>
    <p className="mt-6 text-ash text-sm" aria-live="polite">{list.length} {list.length === 1 ? 'product' : 'products'}</p>
    {list.length ? <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8">{list.map(p => <ProductCard key={p.id} p={p} />)}</div>
      : <div className="py-24"><p className="disp text-3xl">{configured ? (products.length ? 'Nothing matches' : 'No products yet') : 'Store not connected'}</p><p className="text-ash mt-2">{configured ? (products.length ? 'Try removing a filter.' : 'Products will appear here once added in the admin dashboard.') : 'Connect Supabase (see README.md).'}</p>{products.length > 0 && <button className="btn mt-5" onClick={reset}>Clear filters</button>}</div>}
  </div>);
}
