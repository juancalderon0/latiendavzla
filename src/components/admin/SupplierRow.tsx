"use client";

import { useState } from "react";

interface Supplier {
  id: number;
  name: string;
  website: string | null;
  whatsapp: string | null;
  notes: string | null;
  product_count: string;
}

export function SupplierRow({ supplier }: { supplier: Supplier }) {
  const [whatsapp, setWhatsapp] = useState(supplier.whatsapp ?? "");
  const [website, setWebsite] = useState(supplier.website ?? "");
  const [saved, setSaved] = useState(false);

  async function save() {
    await fetch(`/api/admin/suppliers/${supplier.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ website, whatsapp, notes: supplier.notes }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <tr className="border-b border-black/5">
      <td className="p-3 font-medium">{supplier.name}</td>
      <td className="p-3 text-center">{supplier.product_count}</td>
      <td className="p-3">
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://..."
          className="w-full rounded border border-black/15 px-2 py-1 text-xs"
        />
      </td>
      <td className="p-3">
        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="584121234567"
          className="w-32 rounded border border-black/15 px-2 py-1 text-xs"
        />
      </td>
      <td className="p-3">
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-green-600 px-3 py-1 text-xs text-white"
          >
            Chatear
          </a>
        )}
      </td>
      <td className="p-3">
        <button
          onClick={save}
          className="rounded-full bg-black px-3 py-1 text-xs text-white"
        >
          {saved ? "Guardado ✓" : "Guardar"}
        </button>
      </td>
    </tr>
  );
}
