import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProducts, getSettings } from '@/lib/data';
import { configured } from '@/lib/supabase';
import { CATEGORIES, type Product } from '@/lib/types';
export const dynamic = 'force-dynamic';
function Row({ title, list, href }: { title: string; list: Product[]; href: string }) {
  if (!list.length) return null;
  return (<section className="px-4 md:px-8 pt-16"><div className="flex items-end justify-between mb-6"><h2 className="disp text-3xl md:text-5xl">{title}</h2><Link href={href} className="font-semibold underline underline-offset-4 hover:text-accent">See all</Link></div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8">{list.slice(0, 4).map(p => <ProductCard key={p.id} p={p} />)}</div></section>);
}
export default async function Home() {
  const [all, s] = await Promise.all([getProducts(), getSettings()]);
  const ig = s.instagram_username.replace(/^@/, '');
  return (<>
    <section className="bg-black text-white px-4 md:px-8 pt-14 pb-16 md:pt-24 overflow-hidden">
      <h1 className="disp text-[17vw] md:text-[11vw] hero-line">Sneakers<br />&amp; street<br />wear.</h1>
      <div className="mt-10 flex flex-col md:flex-row md:items-center gap-6 hero-line" style={{ animationDelay: '.2s' }}>
        <Link href="/shop" className="btn !bg-accent hover:!bg-white hover:!text-black text-lg">Shop now</Link>
        <p className="text-white/70 max-w-md">Pick your size, tap Buy now, and send your order to us on Instagram.</p>
      </div>
    </section>
    {!configured && <p className="m-4 p-4 border-2 border-accent">Supabase is not connected yet. Follow README.md, step 2.</p>}
    {configured && all.length === 0 && <div className="px-4 md:px-8 py-20"><p className="disp text-3xl">No products yet</p><p className="mt-3 text-ash">Add your first product in the <Link className="underline" href="/admin">admin dashboard</Link>.</p></div>}
    <Row title="New arrivals" list={all.filter(p => p.is_new)} href="/shop?sort=newest" />
    <Row title="Best sellers" list={all.filter(p => p.is_best_seller)} href="/shop?sort=popular" />
    <Row title="Featured" list={all.filter(p => p.is_featured)} href="/shop" />
    <section className="px-4 md:px-8 pt-16"><h2 className="disp text-3xl md:text-5xl mb-6">Shop by category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{CATEGORIES.map(([k, l]) => { const items = all.filter(p => p.category === k); return (
        <Link key={k} href={`/shop?category=${k}`} className="group relative aspect-[3/4] bg-mist overflow-hidden">
          {items[0]?.images[0] && <img src={items[0].images[0]} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
          <span className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent text-white"><span className="disp text-xl block">{l}</span><span className="text-xs">{items.length} items</span></span></Link>); })}</div></section>
    <section className="px-4 md:px-8 pt-20 grid gap-8 md:grid-cols-3">
      {[['Real stock levels', 'Sizes that are sold out are hidden, so you only see what you can actually order.'], ['Clear prices in RON', 'The price you see is the price in the order message. Previous prices are shown on sale items.'], ['Order by Instagram DM', 'No account or card form. Tap Buy now and we continue in the chat.']].map(([t, d]) => <div key={t} className="border-t-2 border-black pt-4"><h3 className="font-bold text-lg">{t}</h3><p className="text-ash mt-2 max-w-sm">{d}</p></div>)}
    </section>
    {ig && <section className="mx-4 md:mx-8 mt-20 bg-mist p-8 md:p-14 flex flex-col md:flex-row md:items-center justify-between gap-6"><div><h2 className="disp text-3xl md:text-5xl">@{ig}</h2><p className="text-ash mt-3">New drops and restocks are posted on Instagram first.</p></div>
      <a className="btn" href={`https://instagram.com/${ig}`} target="_blank" rel="noopener noreferrer">Follow on Instagram</a></section>}
  </>);
}
