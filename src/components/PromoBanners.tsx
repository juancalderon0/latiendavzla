import Link from "next/link";

export function PromoBanners() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-10">
      <Link
        href="/productos"
        className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-black px-6 py-8 text-center text-white sm:flex-row sm:text-left"
      >
        <div>
          <h3 className="text-xl font-bold sm:text-2xl">Paga como prefieras</h3>
          <p className="mt-1 text-sm text-white/70">
            Pago Móvil · Zelle · Binance Pay · Transferencia bancaria · Cashea (próximamente)
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black">
          Ver catálogo
        </span>
      </Link>
    </section>
  );
}
