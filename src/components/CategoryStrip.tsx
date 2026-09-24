import Link from 'next/link';
import { CATEGORIES } from '@/lib/utils';

// Simple line-icon per category so this needs no extra images or assets.
const ICONS: Record<string, JSX.Element> = {
  Rings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="15" r="6" />
      <path d="M9 9l3-6 3 6" strokeLinejoin="round" />
    </svg>
  ),
  Necklaces: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4c0 6 3.5 10 8 10s8-4 8-10" strokeLinecap="round" />
      <circle cx="12" cy="17" r="2.5" />
    </svg>
  ),
  Earrings: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3a3 3 0 0 1 3 3c0 1.5-1.2 2.4-3 3.5-1.8-1.1-3-2-3-3.5a3 3 0 0 1 3-3Z" />
      <path d="M12 9.5V15" strokeLinecap="round" />
      <circle cx="12" cy="18" r="2.5" />
    </svg>
  ),
  Bracelets: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="12" rx="7" ry="9" />
      <path d="M5 12h14" strokeDasharray="1.5 2.5" strokeLinecap="round" />
    </svg>
  )
};

export default function CategoryStrip() {
  return (
    <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 py-2 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0">
      {CATEGORIES.map((c) => (
        <Link
          key={c}
          href={`/shop?cat=${encodeURIComponent(c)}`}
          className="group flex min-w-[104px] flex-none flex-col items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-5 text-center transition-transform hover:-translate-y-0.5 md:min-w-0"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-surface-2 text-gold transition-colors group-hover:bg-accent group-hover:text-[#1b1300]">
            <span className="h-5 w-5">{ICONS[c]}</span>
          </span>
          <span className="text-sm font-semibold">{c}</span>
        </Link>
      ))}
    </div>
  );
}
