export type CategorySlug =
  | "belleza"
  | "tecnologia"
  | "cuidado-personal"
  | "curiosidades"
  | "salud-y-bienestar"
  | "ropa-mujer";

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  priceUsd: number;
  shortDescription: string;
  description: string;
  highlights: string[];
  image: string;
  origin: string;
  inStock: boolean;
}

export interface CartItem {
  slug: string;
  quantity: number;
}
