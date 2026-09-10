"use client";

import { Fragment, useEffect, useState } from "react";

interface Suggestion {
  id: number;
  slug: string;
  name: string;
  brand: string;
  price: number;
  cost: number | null;
  hasCost: boolean;
  daysInStock: number;
  tieredPct: number;
  maxSafePct: number;
  suggestedPct: number;
  newPrice: number;
  currentMargin: number | null;
  newMargin: number | null;
  extraUnitsNeededPct: number | null;
}

interface ActiveDiscount {
  id: number;
  name: string;
  price_usd: string;
  active_discount_pct: string;
}

function buildCampaignCopy(name: string, oldPrice: number, newPrice: number, pct: number) {
  return `🔥 ¡OFERTA POR TIEMPO LIMITADO! 🔥

${name}

~~$${oldPrice.toFixed(2)}~~ 👉 $${newPrice.toFixed(2)} (-${pct}%)

Aprovecha antes de que se agote 🛍️
📲 Escríbenos por WhatsApp o entra a nuestra tienda en el link de la bio.

#ofertas #descuento #Venezuela #tiendaonline`;
}

export function DiscountsPanel() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [active, setActive] = useState<ActiveDiscount[]>([]);
  const [loading, setLoading] = useState(true);
  const [copyFor, setCopyFor] = useState<Suggestion | null>(null);

  async function load() {
    setLoading(true);
    const [sugRes, prodRes] = await Promise.all([
      fetch("/api/admin/discounts/suggestions"),
      fetch("/api/admin/products"),
    ]);
    setSuggestions(await sugRes.json());
    const products = await prodRes.json();
    setActive(products.filter((p: ActiveDiscount) => Number(p.active_discount_pct) > 0));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(s: Suggestion) {
    await fetch(`/api/admin/discounts/${s.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discountPct: s.suggestedPct }),
    });
    setCopyFor(s);
    await load();
  }

  async function removeDiscount(id: number) {
    await fetch(`/api/admin/discounts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discountPct: 0 }),
    });
    await load();
  }

  if (loading) return <p className="text-sm text-black/50">Cargando...</p>;

  return (
    <div className="flex flex-col gap-10">
      {copyFor && (
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">
              Copy listo para redes — {copyFor.name}
            </h3>
            <button onClick={() => setCopyFor(null)} className="text-xs text-black/50">
              Cerrar
            </button>
          </div>
          <textarea
            readOnly
            className="w-full rounded-lg border border-black/10 bg-white p-3 text-sm"
            rows={8}
            value={buildCampaignCopy(copyFor.name, copyFor.price, copyFor.newPrice, copyFor.suggestedPct)}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                buildCampaignCopy(copyFor.name, copyFor.price, copyFor.newPrice, copyFor.suggestedPct)
              );
            }}
            className="mt-2 rounded-full bg-black px-4 py-2 text-xs font-semibold text-white"
          >
            Copiar texto
          </button>
        </div>
      )}

      <div>
        <h2 className="mb-1 text-lg font-semibold">Descuentos sugeridos</h2>
        <p className="mb-4 text-sm text-black/50">
          Productos con 30+ días de stock sin rotar. El % ya está limitado para no vender bajo costo.
        </p>
        {suggestions.length === 0 ? (
          <p className="text-sm text-black/50">No hay sugerencias por ahora.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-xs text-black/50">
                  <th className="p-3">Producto</th>
                  <th className="p-3">Días en stock</th>
                  <th className="p-3">Precio actual</th>
                  <th className="p-3">Sugerido</th>
                  <th className="p-3">Precio nuevo</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((s) => (
                  <Fragment key={s.id}>
                    <tr className="border-b border-black/5">
                      <td className="p-3">
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-black/40">{s.brand}</div>
                        {!s.hasCost && (
                          <div className="text-xs text-amber-600">Sin costo registrado — % limitado por precaución</div>
                        )}
                      </td>
                      <td className="p-3">{s.daysInStock}</td>
                      <td className="p-3">${s.price.toFixed(2)}</td>
                      <td className="p-3 font-medium">-{s.suggestedPct}%</td>
                      <td className="p-3">${s.newPrice.toFixed(2)}</td>
                      <td className="p-3">
                        {s.suggestedPct > 0 ? (
                          <button
                            onClick={() => approve(s)}
                            className="rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            Aprobar y publicar
                          </button>
                        ) : (
                          <span className="text-xs text-black/40">Sin margen para descuento</span>
                        )}
                      </td>
                    </tr>
                    {s.hasCost && s.currentMargin !== null && s.newMargin !== null && s.suggestedPct > 0 && (
                      <tr className="border-b border-black/5 bg-blue-50/50">
                        <td colSpan={6} className="px-3 pb-3 text-xs text-black/70">
                          📊 Ganas <strong>${s.currentMargin.toFixed(2)}</strong> por unidad al precio normal, y{" "}
                          <strong>${s.newMargin.toFixed(2)}</strong> con el descuento. Para no perder utilidad total,
                          necesitarías vender{" "}
                          <strong>{s.extraUnitsNeededPct ? `${s.extraUnitsNeededPct}% más unidades` : "más unidades"}</strong>{" "}
                          de las que venderías sin el descuento.
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Descuentos activos</h2>
        {active.length === 0 ? (
          <p className="text-sm text-black/50">No hay descuentos activos en este momento.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10 text-left text-xs text-black/50">
                  <th className="p-3">Producto</th>
                  <th className="p-3">Precio</th>
                  <th className="p-3">Descuento</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {active.map((p) => (
                  <tr key={p.id} className="border-b border-black/5">
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3">${Number(p.price_usd).toFixed(2)}</td>
                    <td className="p-3">-{Number(p.active_discount_pct)}%</td>
                    <td className="p-3">
                      <button
                        onClick={() => removeDiscount(p.id)}
                        className="rounded-full border border-black/20 px-3 py-1.5 text-xs"
                      >
                        Quitar descuento
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
