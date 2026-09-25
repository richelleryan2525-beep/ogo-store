import Link from 'next/link';
import Image from 'next/image';
import { SHOP_THE_LOOK } from '@/lib/utils';

export default function ShopTheLook() {
  const items = SHOP_THE_LOOK.filter((i) => i.image);
  if (items.length === 0) return null;

  return (
    <section className="py-6">
      <h2 className="mb-3.5 font-serif text-2xl font-medium">Shop the look</h2>
      <div className="grid gap-3 grid-cols-3">
        {items.map((item, i) => (
          <Link
            key={i}
            href={item.href}
            className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-surface-2"
          >
            <Image
              src={item.image}
              alt=""
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-bg/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-ink shadow">
              Shop the look
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
