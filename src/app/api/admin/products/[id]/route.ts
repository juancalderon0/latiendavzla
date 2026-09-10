import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const EDITABLE_FIELDS = [
  "cost_usd",
  "price_usd",
  "shipping_cost_usd",
  "stock_qty",
  "in_stock",
] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const sets: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  for (const field of EDITABLE_FIELDS) {
    if (field in body) {
      sets.push(`${field} = $${i}`);
      values.push(body[field]);
      i++;
    }
  }

  if (sets.length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 });
  }

  sets.push(`updated_at = now()`);
  values.push(id);

  await query(
    `UPDATE products SET ${sets.join(", ")} WHERE id = $${i}`,
    values
  );

  return NextResponse.json({ ok: true });
}
