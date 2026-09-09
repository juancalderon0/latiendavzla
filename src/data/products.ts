import { Product } from "@/lib/types";

export const products: Product[] = [
  {
    slug: "mindfuel",
    name: "Mindfuel",
    brand: "Mindfuel",
    category: "salud-y-bienestar",
    // Precio de referencia (conversión aprox. del precio en COP). AJUSTA al precio real de venta en Venezuela.
    priceUsd: 35,
    shortDescription:
      "Bebida nootrópica con Melena de León para enfoque y energía sostenida, sin azúcar ni cafeína.",
    description:
      "1,200mg de Melena de León (Lion's Mane) con los nutrientes exactos para eliminar la niebla mental, sostener tu energía y mantener tu mente operando al máximo. Sin azúcar, sin cafeína. 17 servicios por envase.",
    highlights: [
      "2,400mg de Melena de León por dosis diaria",
      "5g de crema de coco (MCTs)",
      "4.5g de proteína",
      "15 vitaminas y minerales esenciales",
      "Sin azúcar, sin cafeína",
    ],
    image: "/products/mindfuel.png",
    origin: "Hecho en Colombia",
    inStock: true,
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string) {
  return products.filter((p) => p.category === category);
}
