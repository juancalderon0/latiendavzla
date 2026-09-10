import { AdminProductsTable } from "@/components/admin/AdminProductsTable";

export const dynamic = "force-dynamic";

export default function AdminProductosPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Productos</h1>
      <AdminProductsTable />
    </div>
  );
}
