import ShopClient from '@/components/ShopClient';
import { getProducts } from '@/lib/data';
import { configured } from '@/lib/supabase';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Shop' };
export default async function Shop({ searchParams }: { searchParams: Promise<{ category?: string; sort?: string }> }) {
  const sp = await searchParams;
  const products = await getProducts();
  return <ShopClient products={products} configured={configured} initialCategory={sp.category || ''} initialSort={sp.sort || 'newest'} />;
}
