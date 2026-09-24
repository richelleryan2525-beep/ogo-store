import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { SITE_URL, STORE_NAME } from '@/lib/utils';
import './globals.css';

const serif = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '500', '600'],
  display: 'swap'
});
const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${STORE_NAME} — Fine Jewelry in Lagos, Nigeria`,
    template: `%s | ${STORE_NAME}`
  },
  description:
    'Hallmarked 18k gold, diamond and silver jewelry handcrafted in Lagos. Shop online with real order tracking, delivery across Nigeria.',
  openGraph: {
    type: 'website',
    siteName: STORE_NAME,
    locale: 'en_NG'
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${serif.variable} ${sans.variable}`}>
      <body className="bg-bg text-ink font-sans antialiased">
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
