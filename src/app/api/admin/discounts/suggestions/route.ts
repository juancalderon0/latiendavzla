import { NextResponse } from "next/server";
import { query } from "@/lib/db";

interface Row {
  id: number;
  slug: string;
  name: string;
  brand: string;
  price_usd: string;
  cost_usd: string | null;
  stock_qty: number;
  active_discount_pct: string;
  days_in_stock: number;
}

const MIN_MARGIN_MULTIPLIER = 1.1; // nunca bajar de 10% de margen sobre el costo
const MAX_DISCOUNT_CAP = 30;

export async function GET() {
  const rows = await query<Row>(`
    SELECT id, slug, name, brand, price_usd, cost_usd, stock_qty, active_discount_pct,
           (CURRENT_DATE - stock_since) AS days_in_stock
    FROM products
    WHERE stock_qty > 0 AND (CURRENT_DATE - stock_since) >= 30 AND active_discount_pct = 0
    ORDER BY days_in_stock DESC
  `);

  const suggestions = rows.map((r) => {
    const price = Number(r.price_usd);
    const cost = r.cost_usd !== null ? Number(r.cost_usd) : null;
    const tieredPct = Math.min(Math.floor(r.days_in_stock / 30) * 5, MAX_DISCOUNT_CAP);

    let maxSafePct = tieredPct;
    let hasCost = false;
    if (cost !== null && cost > 0) {
      hasCost = true;
      const floorPrice = cost * MIN_MARGIN_MULTIPLIER;
      maxSafePct = price > floorPrice
        ? Math.floor(((price - floorPrice) / price) * 100)
        : 0;
    }

    const suggestedPct = Math.max(0, Math.min(tieredPct, maxSafePct));
    const newPrice = Math.round(price * (1 - suggestedPct / 100) * 100) / 100;

    let currentMargin: number | null = null;
    let newMargin: number | null = null;
    let extraUnitsNeededPct: number | null = null;
    if (hasCost && cost !== null) {
      currentMargin = Math.round((price - cost) * 100) / 100;
      newMargin = Math.round((newPrice - cost) * 100) / 100;
      extraUnitsNeededPct = newMargin > 0
        ? Math.round(((currentMargin / newMargin - 1)) * 1000) / 10
        : null;
    }

    return {
      id: r.id,
      slug: r.slug,
      name: r.name,
      brand: r.brand,
      price,
      cost,
      hasCost,
      daysInStock: r.days_in_stock,
      tieredPct,
      maxSafePct,
      suggestedPct,
      newPrice,
      currentMargin,
      newMargin,
      extraUnitsNeededPct,
    };
  });

  return NextResponse.json(suggestions);
}
