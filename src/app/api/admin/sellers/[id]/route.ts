import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const sets: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if ("commissionPct" in body) {
    sets.push(`commission_pct = $${i++}`);
    values.push(body.commissionPct);
  }
  if ("active" in body) {
    sets.push(`active = $${i++}`);
    values.push(body.active);
  }
  if ("whatsapp" in body) {
    sets.push(`whatsapp = $${i++}`);
    values.push(body.whatsapp);
  }

  if (sets.length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 });
  }

  values.push(id);
  await query(`UPDATE sellers SET ${sets.join(", ")} WHERE id = $${i}`, values);

  return NextResponse.json({ ok: true });
}
