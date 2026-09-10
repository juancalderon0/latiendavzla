import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  const rows = await query(`
    SELECT
      s.*,
      COUNT(o.id) FILTER (WHERE o.status = 'confirmed')::int AS confirmed_orders,
      COALESCE(SUM(o.total_usd) FILTER (WHERE o.status = 'confirmed'), 0) AS total_sales_usd,
      COALESCE(SUM(o.commission_usd) FILTER (WHERE o.status = 'confirmed'), 0) AS total_commission_usd,
      COALESCE(SUM(o.commission_usd) FILTER (WHERE o.status = 'confirmed' AND o.commission_paid = false), 0) AS commission_owed_usd
    FROM sellers s
    LEFT JOIN orders o ON o.seller_id = s.id
    GROUP BY s.id
    ORDER BY total_sales_usd DESC
  `);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { name, email, whatsapp, referralCode, commissionPct } = await req.json();

  if (!name || !referralCode) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  try {
    const rows = await query<{ id: number }>(
      `INSERT INTO sellers (name, email, whatsapp, referral_code, commission_pct)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [name, email || null, whatsapp || null, referralCode, commissionPct ?? 20]
    );
    return NextResponse.json({ id: rows[0].id });
  } catch {
    return NextResponse.json({ error: "Ese código de referido ya existe" }, { status: 400 });
  }
}
