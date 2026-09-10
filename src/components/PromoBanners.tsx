import Image from "next/image";
import Link from "next/link";

export function PromoBanners() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-10">
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/productos?categoria=ropa-mujer"
          className="group relative flex h-72 items-end overflow-hidden rounded-2xl md:h-96"
        >
          <Image
            src="/products/set-blusa-legging-aereo.jpg"
            alt="Ropa mujer"
            fill
            priority
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="relative p-6 text-white sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/80">
              Nueva colección
            </div>
            <h3 className="mt-1 text-2xl font-bold sm:text-3xl">
              Ropa deportiva para ellas
            </h3>
            <span className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-black">
              Ver colección
            </span>
          </div>
        </Link>

        <Link
          href="/productos?categoria=salud-y-cuidado-personal"
          className="group relative flex h-72 items-end overflow-hidden rounded-2xl md:h-96"
        >
          <Image
            src="/products/mindfuel.png"
            alt="Salud y cuidado personal"
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="relative p-6 text-white sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/80">
              Bienestar diario
            </div>
            <h3 className="mt-1 text-2xl font-bold sm:text-3xl">
              Cuida tu mente y tu cuerpo
            </h3>
            <span className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-black">
              Ver salud y cuidado personal
            </span>
          </div>
        </Link>
      </div>

      <Link
        href="/productos"
        className="mt-4 flex flex-col items-center justify-between gap-4 rounded-2xl bg-black px-6 py-8 text-center text-white sm:flex-row sm:text-left"
      >
        <div>
          <h3 className="text-xl font-bold sm:text-2xl">Paga como prefieras</h3>
          <p className="mt-1 text-sm text-white/70">
            Pago Móvil · Zelle · Binance Pay · Transferencia bancaria
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black">
          Ver catálogo
        </span>
      </Link>
    </section>
  );
}
