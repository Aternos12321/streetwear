'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CATEGORIES, ron, sortSizes, totalStock, type Product, type Settings } from '@/lib/types';
import { DEFAULT_SETTINGS } from '@/lib/data';

const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Math.random().toString(36).slice(2, 6);
type Draft = Omit<Product, 'id' | 'created_at' | 'slug'> & { id?: string; slug?: string };
const BLANK: Draft = { name: '', brand: '', category: 'shoes', price: 0, original_price: null, description: '', images: [], sizes: {}, colors: [], is_new: true, is_featured: false, is_best_seller: false, sold_out: false, published: false, popularity: 0 };

export default function Admin() {
  const [ready, setReady] = useState(false); const [user, setUser] = useState<any>(null); const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setReady(true); });
    const { data: l } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null)); return () => l.subscription.unsubscribe();
  }, []);
  useEffect(() => { if (!user || !supabase) { setIsAdmin(null); return; } supabase.from('admin_users').select('user_id').eq('user_id', user.id).maybeSingle().then(({ data }) => setIsAdmin(!!data)); }, [user]);
  if (!supabase) return <div className="p-8 max-w-xl"><h1 className="disp text-3xl">Supabase not connected</h1><p className="mt-3">Create .env.local as described in README.md (step 2) and restart the site.</p></div>;
  if (!ready) return <p className="p-8">Loading…</p>;
  if (!user) return <Login />;
  if (isAdmin === null) return <p className="p-8">Checking access…</p>;
  if (!isAdmin) return <div className="p-8 max-w-xl"><h1 className="disp text-3xl">No admin access</h1><p className="mt-3">This account is not an admin. Follow README.md, step 3.</p><button className="btn mt-5" onClick={() => supabase!.auth.signOut()}>Sign out</button></div>;
  return <Dashboard />;
}

function Login() {
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const go = async () => { setBusy(true); setErr(''); const { error } = await supabase!.auth.signInWithPassword({ email, password: pw }); if (error) setErr('Wrong email or password.'); setBusy(false); };
  return (<div className="px-4 py-16 max-w-sm mx-auto"><h1 className="disp text-4xl">Admin</h1>
    <div className="mt-8 grid gap-3" onKeyDown={e => e.key === 'Enter' && go()}>
      <input className="field" type="email" placeholder="Email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="field" type="password" placeholder="Password" autoComplete="current-password" value={pw} onChange={e => setPw(e.target.value)} />
      {err && <p role="alert" className="text-accent font-semibold">{err}</p>}
      <button className="btn" disabled={busy || !email || !pw} onClick={go}>{busy ? 'Signing in…' : 'Sign in'}</button></div></div>);
}

function Dashboard() {
  const [tab, setTab] = useState<'products' | 'settings'>('products'); const [list, setList] = useState<Product[]>([]); const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Draft | null>(null); const [msg, setMsg] = useState('');
  const load = async () => { setLoading(true); const { data, error } = await supabase!.from('products').select('*').order('created_at', { ascending: false }); if (error) setMsg(error.message); setList((data as Product[]) || []); setLoading(false); };
  useEffect(() => { load(); }, []);
  const patch = async (id: string, v: Partial<Product>) => { const { error } = await supabase!.from('products').update(v).eq('id', id); setMsg(error ? error.message : 'Saved.'); load(); };
  const del = async (p: Product) => { if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return; const { error } = await supabase!.from('products').delete().eq('id', p.id); setMsg(error ? error.message : 'Deleted.'); load(); };
  return (<div className="px-4 md:px-8 py-8">
    <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="disp text-3xl md:text-5xl">Dashboard</h1><button className="font-semibold underline" onClick={() => supabase!.auth.signOut()}>Sign out</button></div>
    <div className="mt-6 flex gap-2">{(['products', 'settings'] as const).map(t => <button key={t} className="chip capitalize" aria-pressed={tab === t} onClick={() => { setTab(t); setEdit(null); }}>{t}</button>)}</div>
    {msg && <p role="status" className="mt-4 p-3 bg-mist">{msg}</p>}
    {tab === 'settings' ? <SettingsForm onMsg={setMsg} /> : edit ? <ProductForm draft={edit} onDone={(m) => { setEdit(null); if (m) setMsg(m); load(); }} /> : (<>
      <button className="btn mt-6" onClick={() => setEdit({ ...BLANK })}>Add product</button>
      {loading ? <p className="mt-6">Loading…</p> : !list.length ? <p className="mt-8 text-ash">No products yet. Press “Add product” to create your first one.</p> :
        <div className="mt-6 divide-y divide-line">{list.map(p => (<div key={p.id} className="py-4 flex flex-wrap items-center gap-4">
          <div className="h-20 w-16 bg-mist shrink-0">{p.images[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover" />}</div>
          <div className="flex-1 min-w-[12rem]"><p className="font-semibold">{p.name}</p><p className="text-sm text-ash">{p.brand} · {ron(p.price)} · stock {totalStock(p)}</p>
            <p className="text-xs mt-1">{p.published ? 'Published' : 'Draft'}{p.sold_out ? ' · SOLD OUT' : ''}{p.is_new ? ' · New' : ''}{p.is_featured ? ' · Featured' : ''}{p.is_best_seller ? ' · Best seller' : ''}</p></div>
          <div className="flex flex-wrap gap-2 text-sm font-semibold">
            <button className="chip" onClick={() => setEdit(p)}>Edit</button>
            <button className="chip" onClick={() => patch(p.id, { sold_out: !p.sold_out })}>{p.sold_out ? 'Back in stock' : 'Mark sold out'}</button>
            <button className="chip" onClick={() => patch(p.id, { published: !p.published })}>{p.published ? 'Unpublish' : 'Publish'}</button>
            <button className="chip text-accent" onClick={() => del(p)}>Delete</button></div></div>))}</div>}</>)}
  </div>);
}

function ProductForm({ draft, onDone }: { draft: Draft; onDone: (m?: string) => void }) {
  const [d, setD] = useState<Draft>({ ...draft, sizes: { ...(draft.sizes || {}) } }); const [colors, setColors] = useState((draft.colors || []).join(', ')); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const rows = Object.entries(d.sizes).sort((a, b) => sortSizes(a[0], b[0]));
  const set = (v: Partial<Draft>) => setD({ ...d, ...v });
  const setSizes = (o: Record<string, number>) => set({ sizes: o });
  const addPreset = (arr: string[]) => { const o = { ...d.sizes }; arr.forEach(s => { if (!(s in o)) o[s] = 0; }); setSizes(o); };
  const upload = async (files: FileList | null) => {
    if (!files?.length) return; setBusy(true); setErr(''); const urls: string[] = [];
    for (const f of Array.from(files)) { const ext = (f.name.split('.').pop() || 'jpg').toLowerCase(); const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase!.storage.from('product-images').upload(path, f, { cacheControl: '31536000', contentType: f.type });
      if (error) { setErr('Upload failed: ' + error.message); break; } urls.push(supabase!.storage.from('product-images').getPublicUrl(path).data.publicUrl); }
    set({ images: [...d.images, ...urls] }); setBusy(false);
  };
  const save = async () => {
    if (!d.name.trim()) return setErr('Enter a product name.'); if (!(d.price >= 0) || d.price === null) return setErr('Enter a price.');
    if (d.original_price && d.original_price <= d.price) return setErr('Original price must be higher than the price, or leave it empty.');
    setBusy(true); setErr('');
    const row: any = { name: d.name.trim(), brand: d.brand.trim(), category: d.category, price: Number(d.price), original_price: d.original_price ? Number(d.original_price) : null, description: d.description, images: d.images, sizes: d.sizes, colors: colors.split(',').map(c => c.trim()).filter(Boolean), is_new: d.is_new, is_featured: d.is_featured, is_best_seller: d.is_best_seller, sold_out: d.sold_out, published: d.published, popularity: Number(d.popularity) || 0 };
    const { error } = d.id ? await supabase!.from('products').update(row).eq('id', d.id) : await supabase!.from('products').insert({ ...row, slug: slugify(d.name) });
    setBusy(false); if (error) setErr(error.message); else onDone(d.published ? 'Product saved and published.' : 'Product saved as draft.');
  };
  const L = ({ t, children }: { t: string; children: React.ReactNode }) => <label className="block"><span className="block text-sm font-semibold mb-1">{t}</span>{children}</label>;
  const Chk = ({ k, t }: { k: 'is_new' | 'is_featured' | 'is_best_seller' | 'sold_out' | 'published'; t: string }) => <label className="flex items-center gap-2"><input type="checkbox" className="h-5 w-5 accent-black" checked={d[k]} onChange={e => set({ [k]: e.target.checked } as any)} />{t}</label>;
  return (<div className="mt-6 max-w-3xl grid gap-5">
    <h2 className="disp text-2xl">{d.id ? 'Edit product' : 'New product'}</h2>
    <div className="grid md:grid-cols-2 gap-4"><L t="Name"><input className="field" value={d.name} onChange={e => set({ name: e.target.value })} /></L><L t="Brand"><input className="field" value={d.brand} onChange={e => set({ brand: e.target.value })} /></L>
      <L t="Category"><select className="field" value={d.category} onChange={e => set({ category: e.target.value as any })}>{CATEGORIES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></L>
      <L t="Colours (separate with commas)"><input className="field" placeholder="Black, White" value={colors} onChange={e => setColors(e.target.value)} /></L>
      <L t="Price (RON)"><input className="field" type="number" min={0} value={d.price} onChange={e => set({ price: e.target.value as any })} /></L>
      <L t="Original price (RON, only if on sale)"><input className="field" type="number" min={0} value={d.original_price ?? ''} onChange={e => set({ original_price: e.target.value === '' ? null : (e.target.value as any) })} /></L></div>
    <L t="Description"><textarea className="field h-32" value={d.description} onChange={e => set({ description: e.target.value })} /></L>
    <div><p className="text-sm font-semibold mb-1">Photos (the first one is the main photo)</p>
      <div className="flex flex-wrap gap-3">{d.images.map((u, i) => <div key={u} className="w-24"><img src={u} alt="" className="h-28 w-24 object-cover bg-mist" />
        <div className="flex justify-between text-xs mt-1"><button disabled={i === 0} onClick={() => { const a = [...d.images]; [a[i - 1], a[i]] = [a[i], a[i - 1]]; set({ images: a }); }}>← Move</button><button className="text-accent" onClick={() => set({ images: d.images.filter(x => x !== u) })}>Remove</button></div></div>)}</div>
      <input className="mt-3" type="file" accept="image/*" multiple onChange={e => upload(e.target.files)} /></div>
    <div><p className="text-sm font-semibold mb-1">Sizes and stock (a size with 0 stock is hidden from customers)</p>
      <div className="flex flex-wrap gap-2 mb-3 text-sm"><button className="chip" onClick={() => addPreset(Array.from({ length: 11 }, (_, i) => String(38 + i)))}>Add shoe sizes 38–48</button><button className="chip" onClick={() => addPreset(['S', 'M', 'L', 'XL', 'XXL'])}>Add S–XXL</button><button className="chip" onClick={() => addPreset(['One size'])}>One size</button></div>
      <div className="grid gap-2">{rows.map(([s, q]) => <div key={s} className="flex items-center gap-3"><span className="w-20 font-semibold">{s}</span><input className="field !w-24" type="number" min={0} value={q} onChange={e => setSizes({ ...d.sizes, [s]: Math.max(0, Number(e.target.value)) })} aria-label={`Stock for ${s}`} /><span className="text-sm text-ash">in stock</span><button className="text-accent text-sm" onClick={() => { const o = { ...d.sizes }; delete o[s]; setSizes(o); }}>Remove</button></div>)}</div>
      <button className="chip mt-3 text-sm" onClick={() => { const s = prompt('Size name (for example 42 or M)'); if (s?.trim()) setSizes({ ...d.sizes, [s.trim()]: 1 }); }}>Add another size</button></div>
    <div className="grid grid-cols-2 gap-3"><Chk k="is_new" t="Mark as New" /><Chk k="is_featured" t="Featured" /><Chk k="is_best_seller" t="Best seller" /><Chk k="sold_out" t="Sold out" /></div>
    <L t="Popularity (higher shows first when sorting by popular)"><input className="field !w-28" type="number" value={d.popularity} onChange={e => set({ popularity: e.target.value as any })} /></L>
    <Chk k="published" t="Published (visible in the store). Untick to keep as a draft." />
    {err && <p role="alert" className="text-accent font-semibold">{err}</p>}
    <div className="flex gap-3"><button className="btn" disabled={busy} onClick={save}>{busy ? 'Working…' : 'Save product'}</button><button className="btn btn-line" onClick={() => onDone()}>Cancel</button></div></div>);
}

const FIELDS: [keyof Settings, string, 'text' | 'area', string?][] = [['store_name', 'Store name', 'text'], ['instagram_username', 'Instagram username (without @)', 'text'], ['announcement', 'Announcement bar text (leave empty to hide)', 'text'], ['contact_email', 'Contact email', 'text'], ['contact_phone', 'Contact phone', 'text'], ['contact_address', 'Address', 'text'], ['delivery', 'Delivery information', 'area'], ['returns', 'Returns and exchange policy', 'area'], ['privacy', 'Privacy policy', 'area'], ['terms', 'Terms and conditions', 'area'], ['faq', 'FAQ', 'area', 'Write each question on its own line, the answer on the lines below, and leave an empty line between questions.']];
function SettingsForm({ onMsg }: { onMsg: (m: string) => void }) {
  const [s, setS] = useState<Settings>(DEFAULT_SETTINGS); const [loaded, setLoaded] = useState(false); const [busy, setBusy] = useState(false);
  useEffect(() => { supabase!.from('settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => { if (data) setS({ ...DEFAULT_SETTINGS, ...data }); setLoaded(true); }); }, []);
  const save = async () => { setBusy(true); const { id, ...rest } = s as any; const { error } = await supabase!.from('settings').upsert({ id: 1, ...rest, instagram_username: s.instagram_username.replace(/^@/, '').trim() }); setBusy(false); onMsg(error ? error.message : 'Settings saved. The store updates within about 30 seconds.'); };
  if (!loaded) return <p className="mt-6">Loading…</p>;
  return (<div className="mt-6 max-w-2xl grid gap-4"><p className="text-sm text-ash">Write your real policies here. Pages stay empty until you fill them in.</p>
    {FIELDS.map(([k, label, type, hint]) => <label key={k} className="block"><span className="block text-sm font-semibold mb-1">{label}</span>{hint && <span className="block text-xs text-ash mb-1">{hint}</span>}
      {type === 'text' ? <input className="field" value={s[k]} onChange={e => setS({ ...s, [k]: e.target.value })} /> : <textarea className="field h-36" value={s[k]} onChange={e => setS({ ...s, [k]: e.target.value })} />}</label>)}
    <button className="btn w-fit" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save settings'}</button></div>);
}
