import { query } from "@/lib/db";
import { Product } from "@/lib/types";

interface ProductRow {
  slug: string;
  name: string;
  brand: string;
  category: string;
  price_usd: string;
  active_discount_pct: string;
  short_description: string | null;
  description: string | null;
  highlights: string[];
  image: string;
  origin: string | null;
  in_stock: boolean;
  stock_qty: number;
}

function toProduct(row: ProductRow): Product {
  const basePrice = Number(row.price_usd);
  const discountPct = Number(row.active_discount_pct) || 0;
  const finalPrice = discountPct > 0
    ? Math.round(basePrice * (1 - discountPct / 100) * 100) / 100
    : basePrice;

  return {
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    category: row.category as Product["category"],
    priceUsd: finalPrice,
    originalPriceUsd: discountPct > 0 ? basePrice : undefined,
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    highlights: row.highlights ?? [],
    image: row.image,
    origin: row.origin ?? "",
    inStock: row.in_stock && row.stock_qty >= 0,
  };
}

const SELECT_FIELDS = `
  slug, name, brand, category, price_usd, active_discount_pct,
  short_description, description, highlights, image, origin, in_stock, stock_qty
`;

export async function getAllProducts(): Promise<Product[]> {
  const rows = await query<ProductRow>(
    `SELECT ${SELECT_FIELDS} FROM products ORDER BY category, name`
  );
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const rows = await query<ProductRow>(
    `SELECT ${SELECT_FIELDS} FROM products WHERE slug = $1`,
    [slug]
  );
  return rows[0] ? toProduct(rows[0]) : null;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const rows = await query<ProductRow>(
    `SELECT ${SELECT_FIELDS} FROM products WHERE category = $1 ORDER BY name`,
    [category]
  );
  return rows.map(toProduct);
}
