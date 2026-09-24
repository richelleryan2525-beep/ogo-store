import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPolicyPage, POLICY_PAGES } from '@/lib/policyContent';
import { STORE_NAME } from '@/lib/utils';

export function generateStaticParams() {
  return POLICY_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = getPolicyPage(params.slug);
  if (!page) return {};
  return {
    title: page.title,
    alternates: { canonical: `/page/${page.slug}` }
  };
}

export default function PolicyPage({ params }: { params: { slug: string } }) {
  const page = getPolicyPage(params.slug);
  if (!page) notFound();
  return (
    <div className="prose mx-auto max-w-2xl px-4 py-8 md:px-6">
      <h1 className="mb-2 font-serif text-3xl font-medium md:text-4xl">{page.title}</h1>
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: page.html }} />
      <p className="mt-8 text-xs text-muted">© {new Date().getFullYear()} {STORE_NAME}</p>
    </div>
  );
}
