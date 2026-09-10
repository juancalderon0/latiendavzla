import { SellersPanel } from "@/components/admin/SellersPanel";

export const dynamic = "force-dynamic";

export default function AdminVendedoresPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Vendedores</h1>
      <p className="mb-6 text-sm text-black/50">
        Cada vendedor tiene su propio link de referido — si alguien compra a través de él, la venta
        y la comisión se registran solas.
      </p>
      <SellersPanel />
    </div>
  );
}
