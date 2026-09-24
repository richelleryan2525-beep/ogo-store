import Link from 'next/link';
import { STORE_NAME } from '@/lib/utils';

const CATS = ['Rings', 'Necklaces', 'Earrings', 'Bracelets'];
const HELP = [
  ['Shipping & delivery', 'shipping'],
  ['Returns & resizing', 'returns'],
  ['Jewelry care', 'care'],
  ['Terms of sale', 'terms'],
  ['Privacy policy', 'privacy'],
  ['About us', 'about'],
  ['Contact', 'contact']
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface-2 pb-10 pt-10">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-[2fr_1fr_1fr_1.2fr] md:px-6">
        <div>
          <p className="font-serif text-2xl font-semibold tracking-[0.3em]">{STORE_NAME}</p>
          <p className="mt-2 max-w-[38ch] text-sm text-muted">
            Fine jewelry handcrafted in Lagos. Order online with real-time tracking, or reach us on WhatsApp.
          </p>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-bold">Shop</h2>
          <ul>
            {CATS.map((c) => (
              <li key={c}>
                <Link href={`/shop?cat=${c}`} className="inline-block py-1.5 text-sm text-ink-2 hover:text-gold">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-bold">Help</h2>
          <ul>
            {HELP.map(([label, slug]) => (
              <li key={slug}>
                <Link href={`/page/${slug}`} className="inline-block py-1.5 text-sm text-ink-2 hover:text-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-bold">My account</h2>
          <ul>
            <li><Link href="/orders" className="inline-block py-1.5 text-sm text-ink-2 hover:text-gold">Track an order</Link></li>
            <li><Link href="/wishlist" className="inline-block py-1.5 text-sm text-ink-2 hover:text-gold">Saved pieces</Link></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl px-5 text-xs text-muted md:px-6">
        © {new Date().getFullYear()} {STORE_NAME}. Prices are in Nigerian Naira (₦). We handle personal data in
        line with the Nigeria Data Protection Act (NDPA).
      </p>
    </footer>
  );
}
