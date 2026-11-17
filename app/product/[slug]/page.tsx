import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductClient from '@/components/ProductClient';
import { getProduct, getProducts, getSettings } from '@/lib/data';
import { ron } from '@/lib/types';
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProduct(slug); if (!p) return { title: 'Product not found' };
  return { title: p.name, description: `${p.brand} ${p.name} for ${ron(p.price)}. ${p.description}`.slice(0, 160), openGraph: { images: p.images[0] ? [p.images[0]] : [] } };
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [p, all, s] = await Promise.all([getProduct(slug), getProducts(), getSettings()]);
  if (!p) notFound();
  const related = all.filter(x => x.id !== p.id && x.category === p.category).slice(0, 4);
  return <ProductClient p={p} related={related} instagram={s.instagram_username} />;
}
