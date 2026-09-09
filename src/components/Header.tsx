"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { STORE } from "@/lib/config";
import { categories } from "@/data/categories";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          {STORE.name}
        </Link>
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
    </header>
  );
}
