import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { website, whatsapp, notes } = await req.json();

  await query(
    `UPDATE suppliers SET website = $1, whatsapp = $2, notes = $3 WHERE id = $4`,
    [website ?? null, whatsapp ?? null, notes ?? null, id]
  );

  return NextResponse.json({ ok: true });
}
