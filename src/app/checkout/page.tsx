"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatUsd } from "@/lib/format";
import { manualPaymentMethods } from "@/lib/payments/manual";
import { STORE } from "@/lib/config";

export default function CheckoutPage() {
  const { lines, totalUsd, clear } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [methodId, setMethodId] = useState(manualPaymentMethods[0]?.id ?? "");
  const [instagram, setInstagram] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  async function handleConfirm() {
    if (!canConfirm || submitting) return;
    setSubmitting(true);

    let orderId: number | null = null;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          address,
          paymentMethod: method!.name,
          totalUsd,
          instagramHandle: instagram.trim() || null,
          items: lines.map((l) => ({
            slug: l.item.slug,
            name: l.item.name,
            priceUsd: l.item.priceUsd,
            quantity: l.item.quantity,
          })),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        orderId = data.id;
      }
    } catch {
      // Si falla, igual dejamos que el mensaje de WhatsApp salga sin el link de seguimiento.
    }

    const orderText = [
      `Hola, quiero confirmar mi pedido en ${STORE.name}:`,
      "",
      ...lines.map(
        (l) => `- ${l.item.name} x${l.item.quantity} — ${formatUsd(l.item.priceUsd * l.item.quantity)}`
      ),
      "",
      `Total: ${formatUsd(totalUsd)}`,
      `Método de pago: ${method!.name}`,
      "",
      `Nombre: ${name}`,
      `Teléfono: ${phone}`,
      `Dirección de entrega: ${address}`,
      "",
      "Adjunto el comprobante de pago.",
      ...(orderId ? ["", `Confirmar en el panel: ${window.location.origin}/admin/pedidos/${orderId}`] : []),
    ].join("\n");

    const whatsappHref = `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(orderText)}`;
    window.open(whatsappHref, "_blank");
    clear();
    setSubmitting(false);
  }

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

        <div className="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-purple-600 p-5 text-white">
          <h3 className="font-bold">🎁 ¿Quieres ganar premios y descuentos?</h3>
          <p className="mt-1 text-sm text-white/85">
            Síguenos en Instagram y déjanos tu usuario — participas por
            productos, descuentos y sorpresas exclusivas para seguidores.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@tu_usuario_de_instagram"
              className="flex-1 rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm text-white placeholder-white/60 outline-none focus:bg-white/20"
            />
            <a
              href={STORE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-white px-4 py-2 text-center text-sm font-semibold text-fuchsia-700 hover:bg-white/90"
            >
              Síguenos
            </a>
          </div>
          <p className="mt-2 text-xs text-white/60">Opcional — solo si quieres participar.</p>
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

            <div className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-black/10 bg-black/5 p-3 text-sm opacity-70">
              <Image src="/cashea-logo.png" alt="Cashea" width={70} height={24} className="shrink-0" />
              <div className="flex-1">
                <div className="font-medium">Compra ahora, paga después</div>
                <div className="text-black/50">En cuotas sin interés con Cashea</div>
              </div>
              <span className="shrink-0 rounded-full bg-black/10 px-2 py-1 text-xs font-medium text-black/60">
                Próximamente
              </span>
            </div>
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
            <div key={l.item.slug} className="flex justify-between">
              <span>
                {l.item.name} x{l.item.quantity}
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
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="mt-6 block w-full rounded-full bg-green-600 px-6 py-3 text-center text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {submitting ? "Creando pedido..." : "Confirmar pedido por WhatsApp"}
          </button>
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
