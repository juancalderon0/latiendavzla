"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { STORE } from "@/lib/config";
import { categories } from "@/data/categories";

export function Header() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5 md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              {menuOpen ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <Link href="/" className="text-lg font-bold tracking-tight">
            {STORE.name}
          </Link>
        </div>

        <nav className="hidden gap-5 text-sm text-black/70 md:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/productos?categoria=${c.slug}`}
              className="hover:text-black"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <Link
          href="/carrito"
          className="relative rounded-full border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5"
        >
          Carrito
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-xs text-white">
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {menuOpen && (
        <nav className="flex flex-col border-t border-black/10 bg-white px-4 py-2 text-sm md:hidden">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/productos?categoria=${c.slug}`}
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-2 py-3 text-black/80 hover:bg-black/5"
            >
              {c.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
