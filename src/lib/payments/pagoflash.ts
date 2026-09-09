// Integración con PagoFlash — pendiente de activar.
//
// Cuando tengas cuenta comercial y llaves de PagoFlash (docs.pagoflash.com):
// 1. Agrega PAGOFLASH_PUBLIC_KEY y PAGOFLASH_PRIVATE_KEY a las variables de entorno.
// 2. Implementa aquí la llamada a su API para verificar pago móvil / generar
//    un link de pago (PagoClick).
// 3. Reemplaza el uso de `submitManualPayment` en el checkout por esta función.
//
// Se deja el archivo como referencia para no rediseñar el checkout cuando
// se conecte la pasarela real.

import { PaymentResult } from "./types";

export async function submitPagoFlashPayment(): Promise<PaymentResult> {
  throw new Error("PagoFlash aún no está conectado. Usa el pago manual por ahora.");
}
