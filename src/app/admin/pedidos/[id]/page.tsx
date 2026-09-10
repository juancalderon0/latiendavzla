import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import { ConfirmOrderButton } from "@/components/admin/ConfirmOrderButton";

export const dynamic = "force-dynamic";

interface OrderItemRow {
  product_name: string;
  unit_price_usd: string;
  quantity: number;
}

export default async function AdminPedidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const orders = await query<{
    id: number;
    status: string;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    payment_method: string;
    total_usd: string;
    instagram_handle: string | null;
    created_at: string;
  }>(`SELECT * FROM orders WHERE id = $1`, [id]);

  const order = orders[0];
  if (!order) notFound();

  const items = await query<OrderItemRow>(
    `SELECT product_name, unit_price_usd, quantity FROM order_items WHERE order_id = $1`,
    [id]
  );

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Pedido #{order.id}</h1>

      <div className="rounded-xl border border-black/10 bg-white p-6">
        <h2 className="mb-3 font-semibold">Cliente</h2>
        <dl className="grid grid-cols-[100px_1fr] gap-y-1 text-sm">
          <dt className="text-black/50">Nombre</dt>
          <dd>{order.customer_name}</dd>
          <dt className="text-black/50">Teléfono</dt>
          <dd>{order.customer_phone}</dd>
          <dt className="text-black/50">Dirección</dt>
          <dd>{order.customer_address}</dd>
          {order.instagram_handle && (
            <>
              <dt className="text-black/50">Instagram</dt>
              <dd>{order.instagram_handle}</dd>
            </>
          )}
        </dl>

        <h2 className="mb-3 mt-6 font-semibold">Productos</h2>
        <div className="flex flex-col gap-2 text-sm">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>
                {item.product_name} x{item.quantity}
              </span>
              <span>USD {(Number(item.unit_price_usd) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between border-t border-black/10 pt-3 font-bold">
          <span>Total</span>
          <span>USD {Number(order.total_usd).toFixed(2)}</span>
        </div>
        <p className="mt-2 text-sm text-black/60">Método de pago: {order.payment_method}</p>

        <div className="mt-6 border-t border-black/10 pt-6">
          <ConfirmOrderButton orderId={order.id} status={order.status} />
        </div>
      </div>
    </div>
  );
}
