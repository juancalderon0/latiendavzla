import Link from "next/link";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { FeaturedBrands } from "@/components/FeaturedBrands";
import { PromoBanners } from "@/components/PromoBanners";
import { HeroCarousel } from "@/components/HeroCarousel";

export default function Home() {
  const destacados = products.slice(0, 8);

  return (
    <div className="flex flex-col">
      <HeroCarousel />

      <PromoBanners />

      <FeaturedBrands />

      <section className="mx-auto w-full max-w-6xl px-4 pb-12">
        <h2 className="mb-6 text-lg font-semibold">Categorías</h2>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/productos?categoria=${c.slug}`}
              className="flex min-h-20 items-center justify-center rounded-xl border border-black/10 p-3 text-center text-sm transition hover:border-black/30 hover:bg-black/5 sm:min-h-24 sm:p-4 sm:text-base"
            >
              <span className="font-medium leading-tight">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Destacados</h2>
          <Link href="/productos" className="text-sm font-medium hover:underline">
            Ver todo
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {destacados.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
