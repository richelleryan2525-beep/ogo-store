import Link from 'next/link';
import { BRAND_STATEMENT_HEADLINE, BRAND_STATEMENT_BODY } from '@/lib/utils';

export default function BrandStatement() {
  return (
    <section className="grid gap-6 border-y border-line py-12 md:grid-cols-2 md:gap-16 md:py-20">
      <h2 className="font-serif text-3xl font-medium leading-[1.15] tracking-tight md:text-4xl">
        {BRAND_STATEMENT_HEADLINE}
      </h2>
      <div className="text-ink-2">
        <p className="whitespace-pre-line leading-relaxed">{BRAND_STATEMENT_BODY}</p>
        <Link href="/page/about" className="mt-4 inline-block text-sm font-semibold uppercase tracking-widest text-ink underline underline-offset-4">
          About us
        </Link>
      </div>
    </section>
  );
}
