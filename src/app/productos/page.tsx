import Link from "next/link";
import { categories } from "@/data/categories";
import { getAllProducts, getProductsByCategory } from "@/lib/products-db";
import { getBcvRate } from "@/lib/bcv";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const [filtered, bcvRate] = await Promise.all([
    categoria ? getProductsByCategory(categoria) : getAllProducts(),
    getBcvRate(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Catálogo</h1>

      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/productos"
          className={`rounded-full border px-4 py-1.5 text-sm ${
            !categoria
              ? "border-black bg-black text-white"
              : "border-black/10 hover:bg-black/5"
          }`}
        >
          Todos
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/productos?categoria=${c.slug}`}
            className={`rounded-full border px-4 py-1.5 text-sm ${
              categoria === c.slug
                ? "border-black bg-black text-white"
                : "border-black/10 hover:bg-black/5"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-black/60">
          Todavía no hay productos en esta categoría. Vuelve pronto.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} bcvRate={bcvRate} />
          ))}
        </div>
      )}
    </div>
  );
}
