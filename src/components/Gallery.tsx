'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';

export default function Gallery({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0);
  const pics = images.length ? images : ['/placeholder.svg'];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Image src={pics[i]} alt={name} fill priority sizes="(min-width: 860px) 45vw, 100vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
      </div>
      {pics.length > 1 && (
        <div className="mt-2.5 flex gap-2.5">
          {pics.map((src, idx) => (
            <button
              key={src + idx}
              onClick={() => setI(idx)}
              aria-label={`Show photo ${idx + 1}`}
              aria-current={idx === i}
              className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 ${idx === i ? 'border-gold' : 'border-transparent opacity-65'}`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
