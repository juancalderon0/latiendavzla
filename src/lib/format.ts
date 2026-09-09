export function formatUsd(amount: number) {
  return new Intl.NumberFormat("es-VE", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
