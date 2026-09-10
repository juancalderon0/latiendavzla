import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatUsd } from "@/lib/format";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 transition hover:shadow-lg"
    >
      <div className="relative aspect-square bg-neutral-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition group-hover:scale-105"
          sizes="(min-width: 768px) 25vw, 50vw"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs uppercase tracking-wide text-black/50">
          {product.brand}
        </span>
        <h3 className="font-semibold">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-black/60">
          {product.shortDescription}
        </p>
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="font-bold">{formatUsd(product.priceUsd)}</span>
          {product.originalPriceUsd && (
            <span className="text-xs text-black/40 line-through">
              {formatUsd(product.originalPriceUsd)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
