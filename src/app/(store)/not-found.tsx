import Link from 'next/link';
import { GemIcon } from '@/components/Icons';

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-xl justify-items-center gap-3 px-4 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-surface-3 text-gold">
        <GemIcon size={28} />
      </div>
      <h1 className="font-serif text-2xl">We couldn't find that page</h1>
      <p className="text-muted">It may have moved or sold out.</p>
      <Link href="/shop" className="rounded-xl bg-ink px-5 py-3 font-semibold text-bg">
        Browse jewelry
      </Link>
    </div>
  );
}
