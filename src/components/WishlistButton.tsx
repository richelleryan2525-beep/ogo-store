'use client';

import { useWishlist } from '@/context/WishlistContext';
import { HeartIcon } from './Icons';

export default function WishlistButton({ id, name, floating = true }: { id: string; name: string; floating?: boolean }) {
  const { isSaved, toggle } = useWishlist();
  const saved = isSaved(id);
  return (
    <button
      aria-pressed={saved}
      aria-label={`${saved ? 'Remove' : 'Save'} ${name}`}
      onClick={(e) => {
        e.preventDefault();
        toggle(id);
      }}
      className={
        floating
          ? 'absolute right-1 top-1 z-10 grid h-11 w-11 place-items-center text-white drop-shadow-md'
          : 'inline-flex items-center gap-2'
      }
    >
      <HeartIcon size={22} filled={saved} className={saved ? 'text-[#ff6b6b]' : undefined} />
    </button>
  );
}
