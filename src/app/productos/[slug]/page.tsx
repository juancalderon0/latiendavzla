import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products-db";
import { getCategory } from "@/data/categories";
import { formatUsd } from "@/lib/format";
import { getBcvRate, formatBs } from "@/lib/bcv";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductReviews } from "@/components/ProductReviews";

export const dynamic = "force-dynamic";

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, bcvRate] = await Promise.all([getProductBySlug(slug), getBcvRate()]);
  if (!product) notFound();

  const category = getCategory(product.category);

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 md:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex flex-col gap-4">
        {category && (
          <span className="text-xs font-medium uppercase tracking-wide text-black/50">
            {category.name}
          </span>
        )}
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-black/60">{product.shortDescription}</p>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{formatUsd(product.priceUsd)}</span>
            {product.originalPriceUsd && (
              <span className="text-lg text-black/40 line-through">
                {formatUsd(product.originalPriceUsd)}
              </span>
            )}
          </div>
          {bcvRate && (
            <p className="text-sm text-black/50">
              {formatBs(product.priceUsd, bcvRate)} · Tasa BCV: {bcvRate.toFixed(2)} Bs/USD
            </p>
          )}
        </div>

        <AddToCartButton product={product} />

        {(product.category === "ropa-mujer" || product.category === "fajas") && (
          <Link
            href="/guia-tallas"
            className="inline-block w-fit text-sm font-medium text-black/70 underline hover:text-black"
          >
            📏 Ver guía de tallas
          </Link>
        )}

        <div className="mt-4 space-y-4 border-t border-black/10 pt-4 text-sm">
          <p>{product.description}</p>
          <ul className="list-inside list-disc space-y-1 text-black/70">
            {product.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <p className="text-black/50">{product.origin}</p>
          {!product.inStock && (
            <p className="font-medium text-red-600">Agotado momentáneamente</p>
          )}

          {product.category === "joyas" && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-amber-800">
              <span>✅</span>
              <span>
                <strong>Certificado de autenticidad incluido</strong> — pieza en metal real
                (oro 18k o plata 925), verificada por el proveedor.
              </span>
            </div>
          )}

          {(product.category === "ropa-mujer" || product.category === "fajas") && (
            <div className="flex items-start gap-2 rounded-lg bg-neutral-50 p-3 text-black/60">
              <span>ℹ️</span>
              <span>
                Por higiene, esta prenda <strong>no admite devoluciones</strong> una vez
                abierto el empaque o usada, salvo defecto de fábrica.
              </span>
            </div>
          )}
        </div>

        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}
