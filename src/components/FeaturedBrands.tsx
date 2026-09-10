import Image from "next/image";
import Link from "next/link";

const brands = [
  {
    name: "Nobrand",
    tagline: "Ropa deportiva seamless",
    image: "/products/set-short-vainilla.jpg",
    href: "/productos?categoria=ropa-mujer",
  },
  {
    name: "OWfit",
    tagline: "Ropa deportiva femenina",
    image: "/products/buzo-ash.png",
    href: "/productos?categoria=ropa-mujer",
  },
  {
    name: "Colombian Gymwear",
    tagline: "Gymwear de alto impacto",
    image: "/products/malla-gf25q224.jpg",
    href: "/productos?categoria=ropa-mujer",
  },
  {
    name: "Mindfuel",
    tagline: "Nootrópicos y bienestar",
    image: "/products/mindfuel.png",
    href: "/productos?categoria=salud-y-cuidado-personal",
  },
];

export function FeaturedBrands() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16">
      <h2 className="mb-6 text-lg font-semibold">Marcas que vendemos</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {brands.map((b) => (
          <Link
            key={b.name}
            href={b.href}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
          >
            <Image
              src={b.image}
              alt={b.name}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(min-width: 768px) 25vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="font-bold">{b.name}</div>
              <div className="text-xs text-white/80">{b.tagline}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
