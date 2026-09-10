"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatUsd } from "@/lib/format";

export default function CarritoPage() {
  const { lines, totalUsd, setQuantity, removeItem } = useCart();

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <Link
          href="/productos"
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/80"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-8 px-4 py-10 md:grid-cols-3">
      <div className="md:col-span-2">
        <h1 className="mb-6 text-2xl font-bold">Tu carrito</h1>
        <div className="flex flex-col gap-4">
          {lines.map(({ item, subtotal }) => (
            <div
              key={item.slug}
              className="flex gap-4 rounded-xl border border-black/10 p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/productos/${item.slug}`}
                    className="font-medium hover:underline"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.slug)}
                    className="text-xs text-black/40 hover:text-red-600"
                  >
                    Quitar
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(item.slug, item.quantity - 1)}
                      className="h-7 w-7 rounded-full border border-black/20 hover:bg-black/5"
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => setQuantity(item.slug, item.quantity + 1)}
                      className="h-7 w-7 rounded-full border border-black/20 hover:bg-black/5"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold">{formatUsd(subtotal)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-fit rounded-xl border border-black/10 p-6">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatUsd(totalUsd)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-6 block rounded-full bg-black px-6 py-3 text-center text-sm font-semibold text-white hover:bg-black/80"
        >
          Continuar al pago
        </Link>
      </div>
    </div>
  );
}
