'use client';
import { useEffect, useState } from 'react';
export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => { const f = () => setShow(window.scrollY > 700); f(); window.addEventListener('scroll', f, { passive:true }); return () => window.removeEventListener('scroll', f); }, []);
  if (!show) return null;
  return <button aria-label="Back to top" onClick={() => window.scrollTo({ top:0, behavior:'smooth' })} className="fixed bottom-5 right-5 z-40 h-12 w-12 bg-black text-white text-xl hover:bg-accent">↑</button>;
}
