import Link from "next/link";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { STORE } from "@/lib/config";

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="border-b border-black/10 bg-neutral-50 px-4 py-20 text-center">
        <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          {STORE.name}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-black/60">
          Belleza, tecnología, cuidado personal, salud y curiosidades — todo
          en un solo lugar, con envíos en Venezuela.
        </p>
        <Link
          href="/productos"
          className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-black/80"
        >
          Ver catálogo
        </Link>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-lg font-semibold">Categorías</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/productos?categoria=${c.slug}`}
              className="rounded-xl border border-black/10 p-4 text-center transition hover:border-black/30 hover:bg-black/5"
            >
              <div className="font-medium">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <h2 className="mb-6 text-lg font-semibold">Destacados</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
