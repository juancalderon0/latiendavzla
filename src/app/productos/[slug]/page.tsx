import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/products";
import { getCategory } from "@/data/categories";
import { formatUsd } from "@/lib/format";
import { AddToCartButton } from "@/components/AddToCartButton";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
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
        <div className="text-2xl font-bold">{formatUsd(product.priceUsd)}</div>

        <AddToCartButton slug={product.slug} />

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
        </div>
      </div>
    </div>
  );
}
