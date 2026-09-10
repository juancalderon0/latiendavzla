export function Testimonials() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16">
      <h2 className="mb-2 text-lg font-semibold">Lo que dicen nuestros clientes</h2>
      <p className="mb-6 text-sm text-black/50">
        Testimonios reales de clientes de las marcas que vendemos.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-black">
          <video
            src="/testimonios/mindfuel-valentina.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls
            className="aspect-[9/16] w-full object-cover"
          />
          <div className="p-3 text-sm text-white">
            <div className="font-medium">Valentina, sobre Mindfuel</div>
            <div className="text-white/60">&ldquo;Esto cambió mi forma de trabajar&rdquo;</div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4 rounded-2xl border border-black/10 bg-neutral-50 p-6 text-center sm:col-span-2">
          <p className="text-sm text-black/60">
            A medida que lleguen más pedidos, aquí mostraremos las reseñas y
            testimonios reales de tus propios clientes.
          </p>
          <p className="text-xs text-black/40">
            ¿Ya nos compraste? Deja tu reseña en la ficha de cada producto.
          </p>
        </div>
      </div>
    </section>
  );
}
