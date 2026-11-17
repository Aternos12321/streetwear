import { notFound } from 'next/navigation';
import { getSettings } from '@/lib/data';
export const dynamic = 'force-dynamic';
const TITLES: Record<string, string> = { faq: 'FAQ', delivery: 'Delivery', returns: 'Returns & exchanges', privacy: 'Privacy policy', terms: 'Terms & conditions', contact: 'Contact' };
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return { title: TITLES[slug] || 'Info' }; }
export default async function Info({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const title = TITLES[slug]; if (!title) notFound();
  const s = await getSettings(); const ig = s.instagram_username.replace(/^@/, '');
  let body: React.ReactNode = null;
  if (slug === 'contact') {
    const rows: [string, React.ReactNode][] = [];
    if (ig) rows.push(['Instagram', <a key="i" className="underline" href={`https://instagram.com/${ig}`}>@{ig}</a>]);
    if (s.contact_email) rows.push(['Email', <a key="e" className="underline" href={`mailto:${s.contact_email}`}>{s.contact_email}</a>]);
    if (s.contact_phone) rows.push(['Phone', s.contact_phone]);
    if (s.contact_address) rows.push(['Address', s.contact_address]);
    body = rows.length ? <dl className="grid gap-4">{rows.map(([k, v]) => <div key={k}><dt className="text-ash text-sm">{k}</dt><dd className="text-lg">{v}</dd></div>)}</dl> : null;
  } else if (slug === 'faq') {
    const items = s.faq.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean);
    body = items.length ? <div className="divide-y divide-line">{items.map((b, i) => { const [q, ...a] = b.split('\n'); return <details key={i} className="py-4"><summary className="font-semibold cursor-pointer">{q}</summary><p className="mt-2 text-ash whitespace-pre-line">{a.join('\n')}</p></details>; })}</div> : null;
  } else { const t = (s as any)[slug] as string; body = t?.trim() ? <div className="prose-s"><p>{t}</p></div> : null; }
  return (<div className="px-4 md:px-8 py-12 max-w-3xl"><h1 className="disp text-4xl md:text-6xl mb-8">{title}</h1>{body || <p className="text-ash">This page has not been filled in yet. The store owner can add it in the admin dashboard under Settings.</p>}</div>);
}
