import { DiscountsPanel } from "@/components/admin/DiscountsPanel";

export const dynamic = "force-dynamic";

export default function AdminDescuentosPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Descuentos</h1>
      <DiscountsPanel />
    </div>
  );
}
