import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const res = await fetch("https://bcv.today/api/v1/rate.json", {
    cache: "no-store",
  });
  if (!res.ok) {
    return NextResponse.json({ error: "No se pudo obtener la tasa BCV" }, { status: 502 });
  }
  const data = await res.json();
  const usdRate = data.USD;

  if (!usdRate || typeof usdRate !== "number") {
    return NextResponse.json({ error: "Respuesta inválida de BCV" }, { status: 502 });
  }

  await query(
    `INSERT INTO settings (key, value, updated_at) VALUES ('bcv_rate', $1, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [String(usdRate)]
  );

  return NextResponse.json({ ok: true, bcvRate: usdRate, date: data.date });
}
