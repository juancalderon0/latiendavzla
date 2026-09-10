import { FREE_SHIPPING_THRESHOLD } from "@/lib/config";

// Envío gratis a partir de FREE_SHIPPING_THRESHOLD. Fuera de eso, el costo se
// calcula con las tablas de MRW (pendiente por entregar) — mientras tanto se
// confirma por WhatsApp según la dirección del cliente.
export function isFreeShipping(subtotalUsd: number): boolean {
  return subtotalUsd >= FREE_SHIPPING_THRESHOLD;
}

export function getShippingLabel(subtotalUsd: number): string {
  return isFreeShipping(subtotalUsd)
    ? "Gratis"
    : "Se calcula según tu dirección (te lo confirmamos por WhatsApp)";
}
