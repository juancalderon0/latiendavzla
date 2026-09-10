"use client";

import { useEffect, useState } from "react";

interface Review {
  id: number;
  customer_name: string;
  rating: number;
  comment: string | null;
  approved: boolean;
  created_at: string;
  product_name: string;
}

export function ReviewsPanel() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/reviews");
    setReviews(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setApproved(id: number, approved: boolean) {
    await fetch(`/api/admin/reviews/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    await load();
  }

  async function remove(id: number) {
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    await load();
  }

  if (loading) return <p className="text-sm text-black/50">Cargando...</p>;
  if (reviews.length === 0) return <p className="text-sm text-black/50">Aún no hay reseñas de clientes.</p>;

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((r) => (
        <div key={r.id} className="rounded-xl border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">{r.customer_name}</span>
              <span className="ml-2 text-amber-500">{"★".repeat(r.rating)}</span>
              <span className="ml-2 text-xs text-black/40">en {r.product_name}</span>
            </div>
            <span
              className={`rounded-full px-2 py-1 text-xs ${
                r.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {r.approved ? "Publicada" : "Pendiente"}
            </span>
          </div>
          {r.comment && <p className="mt-2 text-sm text-black/70">{r.comment}</p>}
          <div className="mt-3 flex gap-2">
            {!r.approved && (
              <button
                onClick={() => setApproved(r.id, true)}
                className="rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white"
              >
                Aprobar y publicar
              </button>
            )}
            {r.approved && (
              <button
                onClick={() => setApproved(r.id, false)}
                className="rounded-full border border-black/20 px-3 py-1.5 text-xs"
              >
                Ocultar
              </button>
            )}
            <button
              onClick={() => remove(r.id)}
              className="rounded-full border border-red-200 px-3 py-1.5 text-xs text-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
