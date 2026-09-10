"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ConfirmOrderButton({ orderId, status }: { orderId: number; status: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (status === "confirmed") {
    return (
      <span className="inline-block rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
        ✓ Pedido confirmado
      </span>
    );
  }

  async function handleConfirm() {
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}/confirm`, { method: "POST" });
    setLoading(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error || "Error al confirmar el pedido");
    }
  }

  return (
    <button
      onClick={handleConfirm}
      disabled={loading}
      className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/80 disabled:opacity-50"
    >
      {loading ? "Confirmando..." : "Confirmar pago y descontar inventario"}
    </button>
  );
}
