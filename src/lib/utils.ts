import crypto from 'crypto';

export const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || 'ÒGO';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const STORE_WHATSAPP = process.env.NEXT_PUBLIC_STORE_WHATSAPP || '2348000000000';
export const FREE_LAGOS_OVER = Number(process.env.FREE_LAGOS_DELIVERY_OVER || 150000);
// Set NEXT_PUBLIC_HERO_IMAGE to a photo URL (e.g. from Cloudinary) to replace
// the plain gold-glow hero background with a real photo.
export const HERO_IMAGE = process.env.NEXT_PUBLIC_HERO_IMAGE || '';
// Optional background video (mp4). Takes priority over HERO_IMAGE when set;
// HERO_IMAGE is still used as the video's poster frame while it loads.
export const HERO_VIDEO = process.env.NEXT_PUBLIC_HERO_VIDEO || '';
// Adjust which part of a tall/off-center photo shows, e.g. 'top', 'center', 'bottom',
// or precise values like '50% 20%'.
export const HERO_IMAGE_POSITION = process.env.NEXT_PUBLIC_HERO_IMAGE_POSITION || 'center';
export const HERO_BADGE = process.env.NEXT_PUBLIC_HERO_BADGE || 'Detty December & bridal edit';
export const HERO_HEADLINE = process.env.NEXT_PUBLIC_HERO_HEADLINE || 'Heritage gold, crafted for modern royalty';
export const HERO_SUBTEXT =
  process.env.NEXT_PUBLIC_HERO_SUBTEXT ||
  'Hallmarked 18k gold and diamonds, handcrafted in Lagos and delivered across Nigeria with real order tracking.';
export const HERO_CTA_LABEL = process.env.NEXT_PUBLIC_HERO_CTA_LABEL || 'Shop the collection';

export const BRAND_STATEMENT_HEADLINE = process.env.NEXT_PUBLIC_BRAND_HEADLINE || 'Jewelry you can live in';
export const BRAND_STATEMENT_BODY =
  process.env.NEXT_PUBLIC_BRAND_BODY ||
  "Hallmarked gold and diamonds, handcrafted in Lagos — made for everyday wear, not just special occasions.\n\nWe believe fine jewelry shouldn't wait for a birthday or anniversary. It's for marking your own milestones, whenever they happen.";

// Up to 3 "shop the look" photos. Leave an image blank to hide that card.
export const SHOP_THE_LOOK = [
  { image: process.env.NEXT_PUBLIC_LOOK_1_IMAGE || '', href: process.env.NEXT_PUBLIC_LOOK_1_LINK || '/shop' },
  { image: process.env.NEXT_PUBLIC_LOOK_2_IMAGE || '', href: process.env.NEXT_PUBLIC_LOOK_2_LINK || '/shop' },
  { image: process.env.NEXT_PUBLIC_LOOK_3_IMAGE || '', href: process.env.NEXT_PUBLIC_LOOK_3_LINK || '/shop' }
];

export const CATEGORIES = ['Rings', 'Necklaces', 'Earrings', 'Bracelets'] as const;
export const METALS = ['18k Gold', 'Sterling Silver', 'Gold-Plated', 'Stainless Steel'] as const;
export const STONES = ['None', 'Diamond', 'Emerald', 'Pearl'] as const;
export const OCCASIONS = ['Wedding', 'Gift', 'Everyday', 'Owambe'] as const;

export const NG_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT (Abuja)', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

export const DELIVERY_ZONES: Record<string, { fee: number; eta: string }> = {
  Lagos: { fee: 3500, eta: '1–2 business days' },
  Abuja: { fee: 6500, eta: '2–3 business days' },
  Other: { fee: 9000, eta: '3–5 business days' }
};

export function zoneOf(state: string) {
  if (state === 'Lagos') return 'Lagos';
  if (state === 'FCT (Abuja)') return 'Abuja';
  return 'Other';
}

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled'
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending Confirmation',
  confirmed: 'Confirmed — Payment Received',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

export function fmtNaira(n: number) {
  return '₦' + Math.round(n).toLocaleString('en-NG');
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function genOrderNumber() {
  const d = new Date();
  const ymd =
    String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0');
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let r = '';
  for (let i = 0; i < 5; i++) r += abc[crypto.randomInt(0, abc.length)];
  return `OGO-${ymd}-${r}`;
}

export function genTrackingToken() {
  return crypto.randomBytes(16).toString('hex');
}

export function trackingUrl(token: string) {
  return `${SITE_URL}/track/${token}`;
}

export function normalizePhone(phone: string) {
  return phone.replace(/[\s\-()]/g, '');
}

export function isValidNgPhone(phone: string) {
  const p = normalizePhone(phone);
  return /^0[789][01]\d{8}$/.test(p) || /^\+?234[789][01]\d{8}$/.test(p) || /^\+\d{8,15}$/.test(p);
}

// Mongoose .lean() results carry ObjectId/Date instances that React Server
// Components can't pass as props to client components. This strips them to
// plain JSON-safe values (ids and dates become strings).
export function serialize<T>(doc: T): T {
  return JSON.parse(JSON.stringify(doc));
}
