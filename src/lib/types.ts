export type CategorySlug =
  | "belleza"
  | "salud-y-cuidado-personal"
  | "ropa-mujer"
  | "joyas"
  | "fajas";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  priceUsd: number;
  originalPriceUsd?: number;
  shortDescription: string;
  description: string;
  highlights: string[];
  image: string;
  origin: string;
  inStock: boolean;
}

export interface CartItem {
  slug: string;
  name: string;
  image: string;
  priceUsd: number;
  quantity: number;
}
