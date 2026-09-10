import Link from "next/link";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

interface OrderRow {
  id: number;
  status: string;
  customer_name: string;
  customer_phone: string;
  total_usd: string;
  created_at: string;
}

export default async function AdminPedidosPage() {
  const orders = await query<OrderRow>(
    `SELECT id, status, customer_name, customer_phone, total_usd, created_at
     FROM orders ORDER BY created_at DESC LIMIT 100`
  );

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Pedidos</h1>
      <div className="overflow-hidden rounded-xl border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-xs text-black/50">
              <th className="p-3">#</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Total</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-black/5 hover:bg-black/5">
                <td className="p-3">
                  <Link href={`/admin/pedidos/${o.id}`} className="font-medium text-blue-600 hover:underline">
                    #{o.id}
                  </Link>
                </td>
                <td className="p-3">{o.customer_name}</td>
                <td className="p-3">{o.customer_phone}</td>
                <td className="p-3">USD {Number(o.total_usd).toFixed(2)}</td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      o.status === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : o.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {o.status === "confirmed" ? "Confirmado" : o.status === "cancelled" ? "Cancelado" : "Pendiente"}
                  </span>
                </td>
                <td className="p-3 text-xs text-black/50">
                  {new Date(o.created_at).toLocaleString("es-VE")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && <p className="mt-4 text-sm text-black/50">Aún no hay pedidos.</p>}
    </div>
  );
}
