import { STORE_NAME, STORE_WHATSAPP } from '@/lib/utils';
import { WaIcon } from './Icons';

export default function WhatsAppFab() {
  const msg = encodeURIComponent(`Hello ${STORE_NAME}! I have a question about a piece of jewelry.`);
  return (
    <a
      href={`https://wa.me/${STORE_WHATSAPP}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-wa text-white shadow-xl transition-transform hover:scale-105"
    >
      <WaIcon size={28} />
    </a>
  );
}
