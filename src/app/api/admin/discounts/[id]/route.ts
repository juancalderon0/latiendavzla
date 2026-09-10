import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { discountPct } = await req.json();

  await query(
    `UPDATE products
     SET active_discount_pct = $1::numeric,
         discount_approved_at = CASE WHEN $1::numeric > 0 THEN now() ELSE NULL END,
         updated_at = now()
     WHERE id = $2`,
    [discountPct, id]
  );

  return NextResponse.json({ ok: true });
}
