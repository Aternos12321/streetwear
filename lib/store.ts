'use client';
import { useCallback, useEffect, useState } from 'react';
const read = (k:string): string[] => { try { return JSON.parse(localStorage.getItem(k) || '[]'); } catch { return []; } };
export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);
  useEffect(() => { const s = () => setIds(read('wishlist')); s(); window.addEventListener('wl', s); window.addEventListener('storage', s); return () => { window.removeEventListener('wl', s); window.removeEventListener('storage', s); }; }, []);
  const toggle = useCallback((id:string) => { const c = read('wishlist'); const n = c.includes(id) ? c.filter(x=>x!==id) : [...c, id]; try { localStorage.setItem('wishlist', JSON.stringify(n)); } catch {} window.dispatchEvent(new Event('wl')); }, []);
  return { ids, toggle };
}
export const getRecent = () => read('recent');
export const addRecent = (id:string) => { try { localStorage.setItem('recent', JSON.stringify([id, ...read('recent').filter(x=>x!==id)].slice(0, 8))); } catch {} };
