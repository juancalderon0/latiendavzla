import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { approved } = await req.json();
  await query(`UPDATE reviews SET approved = $1 WHERE id = $2`, [approved, id]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await query(`DELETE FROM reviews WHERE id = $1`, [id]);
  return NextResponse.json({ ok: true });
}
