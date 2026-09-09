import { PAGO_MOVIL, STORE, ZELLE } from "@/lib/config";
import { PaymentMethod, PaymentResult } from "./types";

export const manualPaymentMethods: PaymentMethod[] = [
  {
    id: "pago-movil",
    name: "Pago Móvil",
    description: "Transferencia por pago móvil desde cualquier banco del país.",
    instructions: [
      `Banco: ${PAGO_MOVIL.banco}`,
      `Teléfono: ${PAGO_MOVIL.telefono}`,
      `Cédula: ${PAGO_MOVIL.cedula}`,
      `Envía el comprobante por WhatsApp al +${STORE.whatsapp} para confirmar tu pedido.`,
    ],
  },
  {
    id: "zelle",
    name: "Zelle",
    description: "Transferencia en USD vía Zelle.",
    instructions: [
      `Correo: ${ZELLE.email}`,
      `Titular: ${ZELLE.titular}`,
      `Envía el comprobante por WhatsApp al +${STORE.whatsapp} para confirmar tu pedido.`,
    ],
  },
];

// Con pago manual, todo pedido queda pendiente de revisión hasta que
// confirmes el comprobante enviado por el cliente.
export function submitManualPayment(): PaymentResult {
  return { status: "pending_manual_review" };
}
