import { FREE_SHIPPING_THRESHOLD } from "@/lib/config";
import { formatUsd } from "@/lib/format";

export function FreeShippingBanner({ totalUsd }: { totalUsd: number }) {
  const remaining = FREE_SHIPPING_THRESHOLD - totalUsd;

  if (remaining <= 0) {
    return (
      <div className="rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-700">
        🚚 ¡Envío gratis aplicado en tu pedido!
      </div>
    );
  }

  const progress = Math.min(100, (totalUsd / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="rounded-lg bg-neutral-50 p-3 text-sm">
      <p className="text-black/70">
        🚚 Te faltan <strong>{formatUsd(remaining)}</strong> para envío gratis
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/10">
        <div className="h-full rounded-full bg-black transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
