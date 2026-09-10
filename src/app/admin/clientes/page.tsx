import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

interface CustomerRow {
  id: number;
  phone: string;
  name: string;
  address: string | null;
  instagram_handle: string | null;
  total_orders: number;
  total_spent_usd: string;
  last_order_at: string | null;
}

export default async function AdminClientesPage() {
  const customers = await query<CustomerRow>(
    `SELECT * FROM customers ORDER BY total_spent_usd DESC`
  );

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Clientes</h1>
      <p className="mb-6 text-sm text-black/50">
        Se llena solo cada vez que confirmas un pedido — útil para reventa e identificar tus mejores clientes.
      </p>
      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-xs text-black/50">
              <th className="p-3">Cliente</th>
              <th className="p-3">Teléfono</th>
              <th className="p-3">Instagram</th>
              <th className="p-3">Pedidos</th>
              <th className="p-3">Total gastado</th>
              <th className="p-3">Última compra</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-black/5">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">{c.instagram_handle ?? "—"}</td>
                <td className="p-3">{c.total_orders}</td>
                <td className="p-3">USD {Number(c.total_spent_usd).toFixed(2)}</td>
                <td className="p-3 text-xs text-black/50">
                  {c.last_order_at ? new Date(c.last_order_at).toLocaleDateString("es-VE") : "—"}
                </td>
                <td className="p-3">
                  <a
                    href={`https://wa.me/${c.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-green-600 px-3 py-1 text-xs text-white"
                  >
                    Chatear
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {customers.length === 0 && (
        <p className="mt-4 text-sm text-black/50">Aún no hay clientes confirmados.</p>
      )}
    </div>
  );
}
