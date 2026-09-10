import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const orderRes = await client.query(
      `SELECT * FROM orders WHERE id = $1 FOR UPDATE`,
      [id]
    );
    const order = orderRes.rows[0];
    if (!order) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }
    if (order.status === "confirmed") {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Este pedido ya estaba confirmado" }, { status: 400 });
    }

    const itemsRes = await client.query(
      `SELECT product_id, quantity FROM order_items WHERE order_id = $1`,
      [id]
    );

    for (const item of itemsRes.rows) {
      if (!item.product_id) continue;
      await client.query(
        `UPDATE products
         SET stock_qty = GREATEST(stock_qty - $1, 0),
             units_sold = units_sold + $1,
             updated_at = now()
         WHERE id = $2`,
        [item.quantity, item.product_id]
      );
    }

    await client.query(
      `UPDATE orders SET status = 'confirmed', confirmed_at = now() WHERE id = $1`,
      [id]
    );

    await client.query(
      `INSERT INTO customers (phone, name, address, instagram_handle, total_orders, total_spent_usd, last_order_at)
       VALUES ($1, $2, $3, $4, 1, $5, now())
       ON CONFLICT (phone) DO UPDATE SET
         name = EXCLUDED.name,
         address = EXCLUDED.address,
         instagram_handle = COALESCE(EXCLUDED.instagram_handle, customers.instagram_handle),
         total_orders = customers.total_orders + 1,
         total_spent_usd = customers.total_spent_usd + EXCLUDED.total_spent_usd,
         last_order_at = now()`,
      [order.customer_phone, order.customer_name, order.customer_address, order.instagram_handle, order.total_usd]
    );

    await client.query("COMMIT");
    return NextResponse.json({ ok: true });
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
