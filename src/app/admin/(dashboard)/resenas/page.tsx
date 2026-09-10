import { ReviewsPanel } from "@/components/admin/ReviewsPanel";

export const dynamic = "force-dynamic";

export default function AdminResenasPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold">Reseñas</h1>
      <p className="mb-6 text-sm text-black/50">
        Apruébalas antes de que se publiquen en la tienda — evita spam o comentarios falsos.
      </p>
      <ReviewsPanel />
    </div>
  );
}
