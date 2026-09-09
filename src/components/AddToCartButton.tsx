"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

export function AddToCartButton({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        onClick={() => {
          addItem(slug);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/80"
      >
        {added ? "Agregado ✓" : "Agregar al carrito"}
      </button>
      <button
        onClick={() => {
          addItem(slug);
          router.push("/carrito");
        }}
        className="rounded-full border border-black/20 px-6 py-3 text-sm font-semibold hover:bg-black/5"
      >
        Comprar ahora
      </button>
    </div>
  );
}
