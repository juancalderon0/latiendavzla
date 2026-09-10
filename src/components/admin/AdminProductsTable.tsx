"use client";

import { useEffect, useMemo, useState } from "react";

interface AdminProduct {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  cost_usd: string | null;
  price_usd: string;
  shipping_cost_usd: string | null;
  stock_qty: number;
  stock_since: string;
  units_sold: number;
  in_stock: boolean;
  supplier_name: string | null;
  supplier_website: string | null;
  supplier_whatsapp: string | null;
}

export function AdminProductsTable() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todas");
  const [drafts, setDrafts] = useState<Record<number, Partial<AdminProduct>>>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [purchaseOpenId, setPurchaseOpenId] = useState<number | null>(null);
  const [purchaseQty, setPurchaseQty] = useState("");
  const [purchaseCost, setPurchaseCost] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(
    () => ["todas", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const filtered = products.filter((p) => {
    const matchesCategory = category === "todas" || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function getValue(p: AdminProduct, field: keyof AdminProduct): string | number {
    const value = drafts[p.id]?.[field] ?? p[field];
    return value as string | number;
  }

  function setDraft(id: number, field: keyof AdminProduct, value: unknown) {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], [field]: value } }));
  }

  async function save(p: AdminProduct) {
    const draft = drafts[p.id];
    if (!draft) return;
    setSavingId(p.id);
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    setDrafts((d) => {
      const next = { ...d };
      delete next[p.id];
      return next;
    });
    await load();
    setSavingId(null);
  }

  async function submitPurchase(p: AdminProduct) {
    if (!purchaseQty || !purchaseCost) return;
    await fetch("/api/admin/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: p.id,
        quantity: Number(purchaseQty),
        unitCostUsd: Number(purchaseCost),
      }),
    });
    setPurchaseOpenId(null);
    setPurchaseQty("");
    setPurchaseCost("");
    await load();
  }

  if (loading) return <p className="text-sm text-black/50">Cargando...</p>;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="rounded-lg border border-black/15 px-3 py-1.5 text-sm"
        />
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full border px-3 py-1.5 text-xs ${
              category === c ? "border-black bg-black text-white" : "border-black/15"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-xs text-black/50">
              <th className="p-3">Producto</th>
              <th className="p-3">Proveedor</th>
              <th className="p-3">Costo</th>
              <th className="p-3">Envío</th>
              <th className="p-3">Precio venta</th>
              <th className="p-3">Margen</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Vendidos</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const cost = Number(getValue(p, "cost_usd") ?? 0);
              const price = Number(getValue(p, "price_usd") ?? 0);
              const margin = price > 0 ? (((price - cost) / price) * 100).toFixed(0) : "-";
              const hasDraft = Boolean(drafts[p.id]);

              return (
                <tr key={p.id} className="border-b border-black/5 align-top">
                  <td className="p-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-black/40">{p.brand}</div>
                  </td>
                  <td className="p-3 text-xs">
                    <div>{p.supplier_name ?? "—"}</div>
                    {p.supplier_website && (
                      <a
                        href={p.supplier_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Sitio
                      </a>
                    )}
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      step="0.01"
                      value={getValue(p, "cost_usd") ?? ""}
                      onChange={(e) => setDraft(p.id, "cost_usd", e.target.value)}
                      className="w-20 rounded border border-black/15 px-2 py-1"
                      placeholder="—"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      step="0.01"
                      value={getValue(p, "shipping_cost_usd") ?? ""}
                      onChange={(e) => setDraft(p.id, "shipping_cost_usd", e.target.value)}
                      className="w-20 rounded border border-black/15 px-2 py-1"
                      placeholder="—"
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      step="0.01"
                      value={getValue(p, "price_usd") ?? ""}
                      onChange={(e) => setDraft(p.id, "price_usd", e.target.value)}
                      className="w-20 rounded border border-black/15 px-2 py-1 font-medium"
                    />
                  </td>
                  <td className="p-3">
                    <span
                      className={
                        Number(margin) < 15 ? "text-red-600" : "text-green-700"
                      }
                    >
                      {margin === "-" ? "-" : `${margin}%`}
                    </span>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={getValue(p, "stock_qty") ?? 0}
                      onChange={(e) => setDraft(p.id, "stock_qty", Number(e.target.value))}
                      className="w-16 rounded border border-black/15 px-2 py-1"
                    />
                    <button
                      onClick={() => setPurchaseOpenId(purchaseOpenId === p.id ? null : p.id)}
                      className="mt-1 block text-xs text-blue-600 hover:underline"
                    >
                      + Compra
                    </button>
                    {purchaseOpenId === p.id && (
                      <div className="mt-2 flex flex-col gap-1 rounded-lg border border-black/10 bg-neutral-50 p-2">
                        <input
                          type="number"
                          placeholder="Cantidad"
                          value={purchaseQty}
                          onChange={(e) => setPurchaseQty(e.target.value)}
                          className="w-24 rounded border border-black/15 px-1.5 py-1 text-xs"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Costo unit."
                          value={purchaseCost}
                          onChange={(e) => setPurchaseCost(e.target.value)}
                          className="w-24 rounded border border-black/15 px-1.5 py-1 text-xs"
                        />
                        <button
                          onClick={() => submitPurchase(p)}
                          className="rounded bg-black px-2 py-1 text-xs text-white"
                        >
                          Registrar
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-3">{p.units_sold}</td>
                  <td className="p-3">
                    {hasDraft && (
                      <button
                        onClick={() => save(p)}
                        disabled={savingId === p.id}
                        className="rounded-full bg-black px-3 py-1 text-xs text-white disabled:opacity-50"
                      >
                        {savingId === p.id ? "..." : "Guardar"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-black/40">{filtered.length} productos</p>
    </div>
  );
}
