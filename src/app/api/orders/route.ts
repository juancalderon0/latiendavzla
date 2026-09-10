import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

interface OrderItemInput {
  slug: string;
  name: string;
  priceUsd: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  const { name, phone, address, paymentMethod, totalUsd, items, instagramHandle } = await req.json();

  if (!name || !phone || !address || !paymentMethod || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const orderRes = await client.query<{ id: number }>(
      `INSERT INTO orders (status, customer_name, customer_phone, customer_address, payment_method, total_usd, instagram_handle)
       VALUES ('pending', $1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [name, phone, address, paymentMethod, totalUsd, instagramHandle || null]
    );
    const orderId = orderRes.rows[0].id;

    for (const item of items as OrderItemInput[]) {
      const productRes = await client.query<{ id: number }>(
        `SELECT id FROM products WHERE slug = $1`,
        [item.slug]
      );
      const productId = productRes.rows[0]?.id ?? null;

      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, unit_price_usd, quantity)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, productId, item.name, item.priceUsd, item.quantity]
      );
    }

    await client.query("COMMIT");
    return NextResponse.json({ id: orderId });
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
