import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { query } from "@/lib/db";
import { STORE } from "@/lib/config";

export const dynamic = "force-dynamic";

interface SellerRow {
  id: number;
  name: string;
  referral_code: string;
  commission_pct: string;
  active: boolean;
}

interface StatsRow {
  confirmed_orders: string;
  total_sales_usd: string;
  total_commission_usd: string;
  commission_owed_usd: string;
}

interface RecentSale {
  created_at: string;
  total_usd: string;
  commission_usd: string | null;
}

export default async function VendedorPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const sellers = await query<SellerRow>(
    `SELECT id, name, referral_code, commission_pct, active FROM sellers WHERE referral_code = $1`,
    [code.toUpperCase()]
  );
  const seller = sellers[0];
  if (!seller) notFound();

  const [stats] = await query<StatsRow>(
    `SELECT
       COUNT(*)::text AS confirmed_orders,
       COALESCE(SUM(total_usd), 0)::text AS total_sales_usd,
       COALESCE(SUM(commission_usd), 0)::text AS total_commission_usd,
       COALESCE(SUM(commission_usd) FILTER (WHERE commission_paid = false), 0)::text AS commission_owed_usd
     FROM orders WHERE seller_id = $1 AND status = 'confirmed'`,
    [seller.id]
  );

  const recentSales = await query<RecentSale>(
    `SELECT created_at, total_usd, commission_usd FROM orders
     WHERE seller_id = $1 AND status = 'confirmed'
     ORDER BY created_at DESC LIMIT 10`,
    [seller.id]
  );

  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const protocol = host.includes("localhost") ? "http" : "https";
  const referralLink = `${protocol}://${host}/?ref=${seller.referral_code}`;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Hola, {seller.name} 👋</h1>
      <p className="mt-1 text-sm text-black/60">
        Tu panel de ventas en {STORE.name}. Comisión: {Number(seller.commission_pct)}% por venta confirmada.
      </p>

      {!seller.active && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Tu código está inactivo — contacta a la tienda si crees que es un error.
        </p>
      )}

      <div className="mt-6 rounded-xl border border-black/10 bg-neutral-50 p-4">
        <p className="text-xs text-black/50">Tu link para compartir</p>
        <p className="mt-1 break-all font-mono text-sm">{referralLink}</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="text-xs text-black/50">Ventas confirmadas</div>
          <div className="mt-1 text-2xl font-bold">{stats?.confirmed_orders ?? 0}</div>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="text-xs text-black/50">Total generado</div>
          <div className="mt-1 text-2xl font-bold">${Number(stats?.total_sales_usd ?? 0).toFixed(2)}</div>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="text-xs text-black/50">Comisión total</div>
          <div className="mt-1 text-2xl font-bold">${Number(stats?.total_commission_usd ?? 0).toFixed(2)}</div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="text-xs text-black/50">Por pagar</div>
          <div className="mt-1 text-2xl font-bold">${Number(stats?.commission_owed_usd ?? 0).toFixed(2)}</div>
        </div>
      </div>

      <h2 className="mb-3 mt-8 font-semibold">Ventas recientes</h2>
      <div className="flex flex-col gap-2">
        {recentSales.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border border-black/10 bg-white p-3 text-sm"
          >
            <span className="text-black/50">
              {new Date(s.created_at).toLocaleDateString("es-VE")}
            </span>
            <span>Venta: ${Number(s.total_usd).toFixed(2)}</span>
            <span className="font-medium text-green-700">
              +${Number(s.commission_usd ?? 0).toFixed(2)}
            </span>
          </div>
        ))}
        {recentSales.length === 0 && (
          <p className="text-sm text-black/50">Aún no tienes ventas confirmadas.</p>
        )}
      </div>
    </div>
  );
}
