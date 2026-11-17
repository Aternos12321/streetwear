import { cache } from 'react';
import { supabase } from './supabase';
import type { Product, Settings } from './types';
export const DEFAULT_SETTINGS: Settings = { store_name:'Your Store', instagram_username:'', contact_email:'', contact_phone:'', contact_address:'', announcement:'', delivery:'', returns:'', privacy:'', terms:'', faq:'' };
export const getProducts = cache(async (): Promise<Product[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from('products').select('*').eq('published', true).order('created_at', { ascending: false });
  if (error) { console.error(error.message); return []; }
  return (data as Product[]) || [];
});
export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  if (!supabase) return null;
  const { data } = await supabase.from('products').select('*').eq('slug', slug).eq('published', true).maybeSingle();
  return (data as Product) || null;
});
export const getSettings = cache(async (): Promise<Settings> => {
  if (!supabase) return DEFAULT_SETTINGS;
  const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
  return { ...DEFAULT_SETTINGS, ...(data || {}) } as Settings;
});
