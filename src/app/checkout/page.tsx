"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatUsd } from "@/lib/format";
import { manualPaymentMethods } from "@/lib/payments/manual";
import { STORE } from "@/lib/config";

export default function CheckoutPage() {
  const { lines, totalUsd } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [methodId, setMethodId] = useState(manualPaymentMethods[0]?.id ?? "");

  const method = manualPaymentMethods.find((m) => m.id === methodId);

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Tu carrito está vacío</h1>
        <Link
          href="/productos"
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/80"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  const canConfirm = name.trim() && phone.trim() && address.trim() && method;

  const orderText = [
    `Hola, quiero confirmar mi pedido en ${STORE.name}:`,
    "",
    ...lines.map(
      (l) => `- ${l.product.name} x${l.quantity} — ${formatUsd(l.subtotal)}`
    ),
    "",
    `Total: ${formatUsd(totalUsd)}`,
    `Método de pago: ${method?.name ?? ""}`,
    "",
    `Nombre: ${name}`,
    `Teléfono: ${phone}`,
    `Dirección de entrega: ${address}`,
    "",
    "Adjunto el comprobante de pago.",
  ].join("\n");

  const whatsappHref = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(
    orderText
  )}`;

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-8 px-4 py-10 md:grid-cols-3">
      <div className="flex flex-col gap-6 md:col-span-2">
        <h1 className="text-2xl font-bold">Checkout</h1>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">Tus datos</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre completo"
            className="rounded-lg border border-black/15 px-4 py-2 text-sm"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Teléfono (para coordinar la entrega)"
            className="rounded-lg border border-black/15 px-4 py-2 text-sm"
          />
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Dirección de entrega"
            rows={3}
            className="rounded-lg border border-black/15 px-4 py-2 text-sm"
          />
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="font-semibold">Método de pago</h2>
          <div className="flex flex-col gap-2">
            {manualPaymentMethods.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer flex-col gap-1 rounded-lg border p-3 text-sm ${
                  methodId === m.id
                    ? "border-black bg-black/5"
                    : "border-black/15"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={methodId === m.id}
                    onChange={() => setMethodId(m.id)}
                  />
                  <span className="font-medium">{m.name}</span>
                </div>
                <span className="pl-6 text-black/60">{m.description}</span>
              </label>
            ))}
          </div>

          {method && (
            <div className="rounded-lg bg-neutral-50 p-4 text-sm">
              <p className="mb-2 font-medium">Datos para tu pago:</p>
              <ul className="space-y-1 text-black/70">
                {method.instructions.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="h-fit rounded-xl border border-black/10 p-6">
        <h2 className="mb-4 font-semibold">Resumen</h2>
        <div className="flex flex-col gap-2 text-sm">
          {lines.map((l) => (
            <div key={l.product.slug} className="flex justify-between">
              <span>
                {l.product.name} x{l.quantity}
              </span>
              <span>{formatUsd(l.subtotal)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4 text-lg font-bold">
          <span>Total</span>
          <span>{formatUsd(totalUsd)}</span>
        </div>

        {canConfirm ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block rounded-full bg-green-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-green-700"
          >
            Confirmar pedido por WhatsApp
          </a>
        ) : (
          <button
            disabled
            className="mt-6 block w-full cursor-not-allowed rounded-full bg-black/20 px-6 py-3 text-center text-sm font-semibold text-white/70"
          >
            Completa tus datos para continuar
          </button>
        )}
        <p className="mt-3 text-xs text-black/50">
          Realiza el pago con los datos indicados y envía el comprobante junto
          con tu pedido por WhatsApp. Tu pedido queda confirmado cuando
          verifiquemos el pago.
        </p>

        <div className="mt-6 flex flex-col gap-2 border-t border-black/10 pt-4 text-xs text-black/60">
          <div className="flex items-center gap-2">
            <span>🔒</span>
            <span>Pago verificado manualmente por nosotros</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🚚</span>
            <span>Envíos a toda Venezuela</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💬</span>
            <span>Atención directa por WhatsApp</span>
          </div>
        </div>
      </div>
    </div>
  );
}
