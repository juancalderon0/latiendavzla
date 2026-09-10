import Link from "next/link";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [productStats] = await query<{ total: string; low_stock: string }>(`
    SELECT COUNT(*)::text AS total,
           COUNT(*) FILTER (WHERE stock_qty <= 3)::text AS low_stock
    FROM products
  `);
  const [orderStats] = await query<{ pending: string; confirmed: string; revenue: string }>(`
    SELECT
      COUNT(*) FILTER (WHERE status = 'pending')::text AS pending,
      COUNT(*) FILTER (WHERE status = 'confirmed')::text AS confirmed,
      COALESCE(SUM(total_usd) FILTER (WHERE status = 'confirmed'), 0)::text AS revenue
    FROM orders
  `);
  const [customerStats] = await query<{ total: string }>(`
    SELECT COUNT(*)::text AS total FROM customers
  `);
  const [discountStats] = await query<{ pending: string }>(`
    SELECT COUNT(*)::text AS pending
    FROM products
    WHERE stock_qty > 0 AND (CURRENT_DATE - stock_since) >= 30 AND active_discount_pct = 0
  `);

  const cards = [
    { label: "Productos en catálogo", value: productStats?.total ?? "0" },
    { label: "Stock bajo (≤3 unidades)", value: productStats?.low_stock ?? "0", warn: true },
    { label: "Pedidos pendientes", value: orderStats?.pending ?? "0" },
    { label: "Pedidos confirmados", value: orderStats?.confirmed ?? "0" },
    { label: "Ingresos confirmados", value: `USD ${Number(orderStats?.revenue ?? 0).toFixed(2)}` },
    { label: "Clientes registrados", value: customerStats?.total ?? "0" },
    { label: "🔔 Descuentos pendientes de aprobar", value: discountStats?.pending ?? "0", warn: true, href: "/admin/descuentos" },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Resumen</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {cards.map((c) => {
          const cardClass = `block rounded-xl border p-4 transition ${
            c.warn && Number(c.value) > 0
              ? "border-red-200 bg-red-50 hover:border-red-300"
              : "border-black/10 bg-white hover:border-black/20"
          }`;
          const content = (
            <>
              <div className="text-xs text-black/50">{c.label}</div>
              <div className="mt-1 text-2xl font-bold">{c.value}</div>
            </>
          );
          return c.href ? (
            <Link key={c.label} href={c.href} className={cardClass}>
              {content}
            </Link>
          ) : (
            <div key={c.label} className={cardClass}>
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
