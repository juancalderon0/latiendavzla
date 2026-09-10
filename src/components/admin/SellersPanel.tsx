"use client";

import { useEffect, useState } from "react";

interface Seller {
  id: number;
  name: string;
  email: string | null;
  whatsapp: string | null;
  referral_code: string;
  commission_pct: string;
  active: boolean;
  confirmed_orders: number;
  total_sales_usd: string;
  total_commission_usd: string;
  commission_owed_usd: string;
}

export function SellersPanel() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [code, setCode] = useState("");
  const [commissionPct, setCommissionPct] = useState("20");
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/sellers");
    setSellers(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function createSeller() {
    setError("");
    if (!name.trim() || !code.trim()) {
      setError("Nombre y código son obligatorios");
      return;
    }
    const res = await fetch("/api/admin/sellers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        whatsapp: whatsapp || null,
        referralCode: code.toUpperCase().replace(/\s+/g, ""),
        commissionPct: Number(commissionPct),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Error al crear vendedor");
      return;
    }
    setName("");
    setWhatsapp("");
    setCode("");
    setCommissionPct("20");
    setShowForm(false);
    await load();
  }

  async function updateCommission(id: number, pct: number) {
    await fetch(`/api/admin/sellers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commissionPct: pct }),
    });
    await load();
  }

  async function toggleActive(id: number, active: boolean) {
    await fetch(`/api/admin/sellers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    await load();
  }

  async function payCommission(id: number) {
    await fetch(`/api/admin/sellers/${id}/pay-commission`, { method: "POST" });
    await load();
  }

  function referralLink(codeValue: string) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/?ref=${codeValue}`;
  }

  function copyLink(seller: Seller) {
    navigator.clipboard.writeText(referralLink(seller.referral_code));
    setCopiedId(seller.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  if (loading) return <p className="text-sm text-black/50">Cargando...</p>;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-black/50">
          Ordenados por ventas generadas — tu ranking de vendedores.
        </p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white"
        >
          {showForm ? "Cancelar" : "+ Nuevo vendedor"}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 flex flex-col gap-2 rounded-xl border border-black/10 bg-white p-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del vendedor"
              className="rounded-lg border border-black/15 px-3 py-2 text-sm"
            />
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="WhatsApp (584121234567)"
              className="rounded-lg border border-black/15 px-3 py-2 text-sm"
            />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Código (ej. MARIA20)"
              className="rounded-lg border border-black/15 px-3 py-2 text-sm"
            />
            <input
              type="number"
              value={commissionPct}
              onChange={(e) => setCommissionPct(e.target.value)}
              placeholder="% comisión"
              className="rounded-lg border border-black/15 px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            onClick={createSeller}
            className="mt-1 self-start rounded-full bg-black px-4 py-2 text-xs font-semibold text-white"
          >
            Crear vendedor
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-xs text-black/50">
              <th className="p-3">Vendedor</th>
              <th className="p-3">Link de referido</th>
              <th className="p-3">Comisión</th>
              <th className="p-3">Pedidos</th>
              <th className="p-3">Ventas generadas</th>
              <th className="p-3">Comisión adeudada</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s.id} className="border-b border-black/5">
                <td className="p-3">
                  <div className="font-medium">{s.name}</div>
                  {s.whatsapp && (
                    <a
                      href={`https://wa.me/${s.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-700 hover:underline"
                    >
                      Chatear
                    </a>
                  )}
                  {!s.active && <div className="text-xs text-red-500">Inactivo</div>}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => copyLink(s)}
                    className="rounded-full border border-black/15 px-2 py-1 text-xs hover:bg-black/5"
                  >
                    {copiedId === s.id ? "Copiado ✓" : `?ref=${s.referral_code}`}
                  </button>
                </td>
                <td className="p-3">
                  <input
                    type="number"
                    defaultValue={Number(s.commission_pct)}
                    onBlur={(e) => updateCommission(s.id, Number(e.target.value))}
                    className="w-16 rounded border border-black/15 px-2 py-1"
                  />
                  %
                </td>
                <td className="p-3">{s.confirmed_orders}</td>
                <td className="p-3">${Number(s.total_sales_usd).toFixed(2)}</td>
                <td className="p-3">
                  <span className={Number(s.commission_owed_usd) > 0 ? "font-semibold text-amber-700" : ""}>
                    ${Number(s.commission_owed_usd).toFixed(2)}
                  </span>
                </td>
                <td className="p-3 flex flex-col gap-1">
                  {Number(s.commission_owed_usd) > 0 && (
                    <button
                      onClick={() => payCommission(s.id)}
                      className="rounded-full bg-green-600 px-3 py-1 text-xs text-white"
                    >
                      Marcar pagado
                    </button>
                  )}
                  <button
                    onClick={() => toggleActive(s.id, !s.active)}
                    className="rounded-full border border-black/15 px-3 py-1 text-xs"
                  >
                    {s.active ? "Desactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sellers.length === 0 && (
        <p className="mt-4 text-sm text-black/50">Aún no tienes vendedores registrados.</p>
      )}
    </div>
  );
}
