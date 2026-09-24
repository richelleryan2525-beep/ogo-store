import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import WhatsAppFab from '@/components/WhatsAppFab';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppFab />
    </>
  );
}
