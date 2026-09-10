import { query } from "@/lib/db";

export async function getBcvRate(): Promise<number | null> {
  const rows = await query<{ value: string }>(
    `SELECT value FROM settings WHERE key = 'bcv_rate'`
  );
  const rate = rows[0]?.value;
  return rate ? Number(rate) : null;
}

export function formatBs(usdAmount: number, bcvRate: number) {
  const bs = usdAmount * bcvRate;
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "VES",
    maximumFractionDigits: 2,
  }).format(bs);
}
