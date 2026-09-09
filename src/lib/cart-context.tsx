"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { CartItem, Product } from "@/lib/types";
import { getProduct } from "@/data/products";

interface CartContextValue {
  items: CartItem[];
  addItem: (slug: string, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  lines: { product: Product; quantity: number; subtotal: number }[];
  totalItems: number;
  totalUsd: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage no disponible; el carrito queda vacío para esta sesión.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignorar si el navegador bloquea localStorage.
    }
  }, [items, hydrated]);

  function addItem(slug: string, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === slug ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { slug, quantity }];
    });
  }

  function removeItem(slug: string) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  function setQuantity(slug: string, quantity: number) {
    if (quantity <= 0) return removeItem(slug);
    setItems((prev) =>
      prev.map((i) => (i.slug === slug ? { ...i, quantity } : i))
    );
  }

  function clear() {
    setItems([]);
  }

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = getProduct(item.slug);
          if (!product) return null;
          return {
            product,
            quantity: item.quantity,
            subtotal: product.priceUsd * item.quantity,
          };
        })
        .filter((l): l is NonNullable<typeof l> => l !== null),
    [items]
  );

  const totalItems = lines.reduce((sum, l) => sum + l.quantity, 0);
  const totalUsd = lines.reduce((sum, l) => sum + l.subtotal, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        setQuantity,
        clear,
        lines,
        totalItems,
        totalUsd,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
