import { BINANCE, PAGO_MOVIL, STORE, TRANSFERENCIA, ZELLE } from "@/lib/config";
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
  {
    id: "binance",
    name: "Binance Pay",
    description: "Pago en criptomonedas (USDT) vía Binance Pay.",
    instructions: [
      `Correo Binance: ${BINANCE.email}`,
      `Envía el comprobante por WhatsApp al +${STORE.whatsapp} para confirmar tu pedido.`,
    ],
  },
  {
    id: "transferencia",
    name: "Transferencia bancaria nacional",
    description: "Transferencia directa a cuenta corriente en bolívares.",
    instructions: [
      `Banco: ${TRANSFERENCIA.banco}`,
      `Tipo de cuenta: ${TRANSFERENCIA.tipoCuenta}`,
      `N° de cuenta: ${TRANSFERENCIA.numeroCuenta}`,
      `Cédula: ${TRANSFERENCIA.cedula}`,
      `Envía el comprobante por WhatsApp al +${STORE.whatsapp} para confirmar tu pedido.`,
    ],
  },
];

// Con pago manual, todo pedido queda pendiente de revisión hasta que
// confirmes el comprobante enviado por el cliente.
export function submitManualPayment(): PaymentResult {
  return { status: "pending_manual_review" };
}
