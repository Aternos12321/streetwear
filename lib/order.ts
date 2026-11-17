import type { Product } from './types';
import { ron } from './types';
export function buildMessage(p: Product, size: string, qty: number, color?: string) {
  const lines = ['Hello! I am interested in buying the following product:', '', `Product: ${p.name}`];
  if (p.brand) lines.push(`Brand: ${p.brand}`);
  lines.push(`Price: ${ron(p.price)}`);
  if (size) lines.push(`Size: ${size}`);
  if (color) lines.push(`Colour: ${color}`);
  lines.push(`Quantity: ${qty}`, '', 'Is this item still available?');
  return lines.join('\n');
}
export const igProfile = (u:string) => `https://ig.me/m/${u.replace(/^@/,'').trim()}`;
