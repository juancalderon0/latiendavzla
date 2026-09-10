import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query(`
    SELECT r.id, r.customer_name, r.rating, r.comment, r.approved, r.created_at,
           p.name AS product_name
    FROM reviews r
    JOIN products p ON p.id = r.product_id
    ORDER BY r.created_at DESC
  `);
  return NextResponse.json(rows);
}
