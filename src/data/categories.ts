import { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "belleza",
    name: "Belleza",
    description: "Maquillaje, skincare y accesorios de belleza.",
  },
  {
    slug: "tecnologia",
    name: "Tecnología",
    description: "Gadgets y accesorios tecnológicos.",
  },
  {
    slug: "cuidado-personal",
    name: "Cuidado personal",
    description: "Higiene y bienestar diario.",
  },
  {
    slug: "salud-y-bienestar",
    name: "Salud y bienestar",
    description: "Suplementos y productos para tu rendimiento y salud.",
  },
  {
    slug: "curiosidades",
    name: "Curiosidades",
    description: "Productos únicos y fuera de lo común.",
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
