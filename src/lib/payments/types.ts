export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  // Instrucciones que se muestran al cliente en el checkout.
  instructions: string[];
}

// Cuando se conecte una pasarela real (ej. PagoFlash), esta función pasa a
// verificar el pago automáticamente en vez de esperar confirmación manual.
export interface PaymentResult {
  status: "pending_manual_review" | "confirmed" | "failed";
  reference?: string;
}
