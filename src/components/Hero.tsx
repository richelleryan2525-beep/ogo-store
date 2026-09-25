'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { STORE_NAME, STORE_WHATSAPP, HERO_IMAGE, HERO_VIDEO, HERO_IMAGE_POSITION, HERO_BADGE, HERO_HEADLINE, HERO_SUBTEXT, HERO_CTA_LABEL } from '@/lib/utils';
import { WaIcon } from './Icons';

export default function Hero() {
  const msg = encodeURIComponent(`Hello ${STORE_NAME}! I'd like help choosing a piece of jewelry.`);

  // Parallax: the photo drifts slower than the page scrolls past the hero.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <section
      ref={sectionRef}
      className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-[#141312] text-[#f2f0ed] min-h-[60svh] md:min-h-screen"
    >
      {HERO_VIDEO ? (
        <motion.div style={{ y: imageY }} className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={HERO_IMAGE || undefined}
            className="h-full w-full object-cover"
            style={{ objectPosition: HERO_IMAGE_POSITION }}
          >
            <source src={HERO_VIDEO} />
          </video>
        </motion.div>
      ) : HERO_IMAGE ? (
        <motion.div style={{ y: imageY }} className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectPosition: HERO_IMAGE_POSITION }}
            className="object-cover"
          />
        </motion.div>
      ) : (
        <motion.div
          style={{ y: imageY }}
          className="pointer-events-none absolute inset-x-0 -top-10 mx-auto h-[76%] aspect-square bg-[radial-gradient(circle_at_center,rgba(233,193,118,0.35),transparent_70%)] md:right-0 md:left-auto md:h-full md:w-[46%]"
        />
      )}
      {/* Light gradient, just enough for the headline to stay readable, so the photo/video reads clearly */}
      <div
        className="absolute inset-0"
        style={{
          background: HERO_VIDEO || HERO_IMAGE
            ? 'linear-gradient(to top, #141312 0%, rgba(20,19,18,.85) 35%, rgba(20,19,18,0.4) 62%)'
            : 'linear-gradient(to top, #141312 12%, rgba(20,19,18,.82) 45%, rgba(20,19,18,0) 78%), linear-gradient(to right, #141312 28%, rgba(20,19,18,.55) 55%, rgba(20,19,18,0) 78%)'
        }}
      />
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex min-h-[60svh] max-w-6xl flex-col justify-end px-5 pb-16 md:min-h-screen md:px-10 md:pb-24"
      >
        <div className="max-w-xl">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-3 inline-block w-fit rounded-full bg-[#e9c176]/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#f0d79b]"
        >
          {HERO_BADGE}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55 }}
          className="font-serif text-4xl font-medium leading-tight tracking-tight md:text-5xl"
        >
          {HERO_HEADLINE}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.55 }}
          className="mb-5 mt-3 max-w-[34ch] text-[#d9d4ca]"
        >
          {HERO_SUBTEXT}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.55 }}
          className="flex flex-col gap-2.5 sm:flex-row"
        >
          <Link
            href="/shop"
            className="flex min-h-[50px] min-w-[210px] items-center justify-center rounded-xl bg-accent px-6 font-semibold uppercase tracking-wide text-[#1b1300]"
          >
            {HERO_CTA_LABEL}
          </Link>
          <a
            href={`https://wa.me/${STORE_WHATSAPP}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[50px] min-w-[210px] items-center justify-center gap-2 rounded-xl bg-wa px-6 font-semibold uppercase tracking-wide text-white"
          >
            <WaIcon size={20} /> Chat with us
          </a>
        </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
