import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { productId, quantity, unitCostUsd, supplierId, notes } = await req.json();

  if (!productId || !quantity || !unitCostUsd) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO purchases (product_id, supplier_id, quantity, unit_cost_usd, notes)
       VALUES ($1, $2, $3, $4, $5)`,
      [productId, supplierId ?? null, quantity, unitCostUsd, notes ?? null]
    );
    await client.query(
      `UPDATE products
       SET stock_qty = stock_qty + $1,
           stock_since = CURRENT_DATE,
           cost_usd = $2,
           updated_at = now()
       WHERE id = $3`,
      [quantity, unitCostUsd, productId]
    );
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }

  return NextResponse.json({ ok: true });
}
