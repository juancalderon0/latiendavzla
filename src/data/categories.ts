import { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "belleza",
    name: "Belleza",
    description: "Maquillaje, skincare y accesorios de belleza.",
  },
  {
    slug: "salud-y-cuidado-personal",
    name: "Salud y cuidado personal",
    description: "Suplementos, higiene y bienestar diario.",
  },
  {
    slug: "ropa-mujer",
    name: "Ropa mujer",
    description: "Ropa deportiva y casual femenina.",
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}
