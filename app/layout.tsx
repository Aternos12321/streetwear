import type { Metadata } from 'next';
import { Archivo, Instrument_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { getSettings } from '@/lib/data';
const disp = Archivo({ subsets:['latin','latin-ext'], axes:['wdth'], variable:'--f-disp' });
const body = Instrument_Sans({ subsets:['latin','latin-ext'], variable:'--f-body' });
export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), title: { default: `${s.store_name} | Sneakers & streetwear`, template: `%s | ${s.store_name}` }, description: 'Sneakers, hoodies, jackets and accessories. Order directly on Instagram.' };
}
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (<html lang="en" className={`${disp.variable} ${body.variable}`}><body>
    {s.announcement && <div className="bg-accent text-white text-center text-sm font-semibold px-4 py-2">{s.announcement}</div>}
    <Header name={s.store_name} />
    <main className="page min-h-[70vh]">{children}</main>
    <Footer s={s} /><BackToTop />
  </body></html>);
}
