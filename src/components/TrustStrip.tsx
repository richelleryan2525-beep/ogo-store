import Reveal from './Reveal';
import { BankIcon, SparkleIcon, TruckIcon, VerifiedIcon } from './Icons';

const ITEMS = [
  { icon: VerifiedIcon, title: 'Hallmarked', sub: '18k gold with certificate' },
  { icon: TruckIcon, title: 'Insured delivery', sub: 'GIG, DHL and Lagos riders' },
  { icon: BankIcon, title: 'Real order tracking', sub: 'Follow your order online' },
  { icon: SparkleIcon, title: 'Free resizing', sub: 'Rings and bracelets' }
];

export default function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="py-6">
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {ITEMS.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.06}>
            <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface p-3">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-surface-3 text-gold">
                <it.icon size={18} />
              </span>
              <div className="min-w-0">
                <b className="block truncate text-sm">{it.title}</b>
                <span className="block text-xs text-muted">{it.sub}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
