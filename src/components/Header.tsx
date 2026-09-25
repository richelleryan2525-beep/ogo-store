"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { STORE_NAME } from "@/lib/utils";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from "./Icons";
import ThemeToggle from "./ThemeToggle";

const CATS = ["Rings", "Necklaces", "Earrings", "Bracelets"];

export default function Header() {
  const { count, openCart } = useCart();
  const { ids } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setSearchOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-3 md:px-6">
        <div className="flex flex-1 items-center gap-1">
          <button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-full hover:text-gold md:hidden"
          >
            <MenuIcon />
          </button>
          <nav
            aria-label="Main"
            className="hidden gap-6 text-sm font-semibold text-ink-2 md:flex"
          >
            <Link href="/shop" className="hover:text-gold">
              Shop
            </Link>
            {CATS.map((c) => (
              <Link key={c} href={`/shop?cat=${c}`} className="hover:text-gold">
                {c}
              </Link>
            ))}
          </nav>
        </div>
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-[0.3em] text-ink"
        >
          {STORE_NAME}
        </Link>
        <div className="flex flex-1 items-center justify-end gap-1">
          <ThemeToggle />
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((s) => !s)}
            className="grid h-11 w-11 place-items-center rounded-full hover:text-gold"
          >
            <SearchIcon />
          </button>
          <Link
            href="/wishlist"
            aria-label="Saved pieces"
            className="relative grid h-11 w-11 place-items-center rounded-full hover:text-gold"
          >
            <HeartIcon />
            {ids.length > 0 && (
              <span className="absolute right-1 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-bg">
                {ids.length}
              </span>
            )}
          </Link>
          <button
            aria-label={`Open bag, ${count} items`}
            onClick={openCart}
            className="relative grid h-11 w-11 place-items-center rounded-full hover:text-gold"
          >
            <BagIcon />
            {count > 0 && (
              <span className="absolute right-1 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-ink">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line"
          >
            <form
              onSubmit={submitSearch}
              className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3"
            >
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search rings, chains, earrings…"
                className="min-h-[46px] flex-1 rounded-xl border border-line bg-surface px-4 text-base"
              />
              <button
                className="min-h-[46px] rounded-xl bg-ink px-5 font-semibold text-bg"
                type="submit"
              >
                Search
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 h-screen left-0 z-50 flex w-full shadow-2xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28 }}
            >
              <div className="w-[82%] max-w-xs flex-col bg-bg flex">
                <div className="flex h-16 items-center justify-between border-b border-line px-5">
                  <span className="font-serif text-lg font-semibold">Menu</span>
                  <button
                    aria-label="Close menu"
                    onClick={() => setMenuOpen(false)}
                    className="grid h-10 w-10 place-items-center"
                  >
                    <CloseIcon />
                  </button>
                </div>
                <nav className="flex-1 overflow-y-auto px-5 py-4 text-base font-medium">
                  <p className="mt-2 text-xs font-semibold uppercase text-muted">
                    Shop
                  </p>
                  <Link
                    href="/shop"
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-line py-3"
                  >
                    All jewelry
                  </Link>
                  {CATS.map((c) => (
                    <Link
                      key={c}
                      href={`/shop?cat=${c}`}
                      onClick={() => setMenuOpen(false)}
                      className="block border-b border-line py-3"
                    >
                      {c}
                    </Link>
                  ))}
                  <p className="mt-4 text-xs font-semibold uppercase text-muted">
                    Help
                  </p>
                  {[
                    ["Shipping & delivery", "shipping"],
                    ["Returns & resizing", "returns"],
                    ["Jewelry care", "care"],
                    ["Terms of sale", "terms"],
                    ["Privacy policy", "privacy"],
                    ["About us", "about"],
                    ["Contact", "contact"],
                  ].map(([label, slug]) => (
                    <Link
                      key={slug}
                      href={`/page/${slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="block border-b border-line py-3"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
              <motion.div
                className="flex-1 h-full bg-black/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeIn" }}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
