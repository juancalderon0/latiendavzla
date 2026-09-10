import { query } from "@/lib/db";
import { SupplierRow } from "@/components/admin/SupplierRow";

export const dynamic = "force-dynamic";

interface SupplierRowData {
  id: number;
  name: string;
  website: string | null;
  whatsapp: string | null;
  notes: string | null;
  product_count: string;
}

export default async function AdminProveedoresPage() {
  const suppliers = await query<SupplierRowData>(`
    SELECT s.*, COUNT(p.id)::text AS product_count
    FROM suppliers s
    LEFT JOIN products p ON p.supplier_id = s.id
    GROUP BY s.id
    ORDER BY s.name
  `);

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Proveedores</h1>
      <p className="mb-6 text-sm text-black/50">
        Agrega el WhatsApp de cada proveedor para poder contactarlos directo desde aquí.
      </p>
      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-xs text-black/50">
              <th className="p-3">Proveedor</th>
              <th className="p-3 text-center">Productos</th>
              <th className="p-3">Sitio web</th>
              <th className="p-3">WhatsApp</th>
              <th className="p-3"></th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s) => (
              <SupplierRow key={s.id} supplier={s} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
