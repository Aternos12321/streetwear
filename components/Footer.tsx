import Link from 'next/link';
import type { Settings } from '@/lib/types';
export default function Footer({ s }: { s: Settings }) {
  const ig = s.instagram_username.replace(/^@/, '');
  const L = ({ h, t }: { h: string; t: string }) => <Link href={h} className="block py-1 text-white/70 hover:text-white">{t}</Link>;
  return (<footer className="bg-black text-white mt-20 px-4 md:px-8 py-14">
    <div className="grid gap-10 md:grid-cols-4">
      <div className="md:col-span-2"><p className="disp text-4xl md:text-6xl">{s.store_name}</p></div>
      <div><p className="font-bold mb-2">Help</p><L h="/info/faq" t="FAQ" /><L h="/info/delivery" t="Delivery" /><L h="/info/returns" t="Returns & exchanges" /><L h="/info/contact" t="Contact" /></div>
      <div><p className="font-bold mb-2">Legal</p><L h="/info/privacy" t="Privacy policy" /><L h="/info/terms" t="Terms & conditions" />
        {ig && <a href={`https://instagram.com/${ig}`} target="_blank" rel="noopener noreferrer" className="block py-1 text-white/70 hover:text-white">Instagram @{ig}</a>}</div>
    </div>
    <p className="mt-12 text-white/50 text-sm">© {new Date().getFullYear()} {s.store_name}</p>
  </footer>);
}
