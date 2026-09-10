import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await query(
    `UPDATE orders SET commission_paid = true
     WHERE seller_id = $1 AND status = 'confirmed' AND commission_paid = false`,
    [id]
  );

  return NextResponse.json({ ok: true });
}
