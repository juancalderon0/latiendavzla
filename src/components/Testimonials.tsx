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
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-black">
          <video
            src="/testimonios/milagros-clientas.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls
            className="aspect-[9/16] w-full object-cover"
          />
          <div className="p-3 text-sm text-white">
            <div className="font-medium">Clientas reales, sobre Milagros Beauty</div>
            <div className="text-white/60">&ldquo;Me recuperó el cabello de una manera milagrosa&rdquo;</div>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-black">
          <video
            src="/testimonios/milagros-experto.mp4"
            autoPlay
            muted
            loop
            playsInline
            controls
            className="aspect-[9/16] w-full object-cover"
          />
          <div className="p-3 text-sm text-white">
            <div className="font-medium">Miguel Cisterna, Presidente de la Asociación Argentina de Tricología</div>
            <div className="text-white/60">Recomendación experta sobre Milagros Beauty</div>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-black/40">
        ¿Ya nos compraste? Deja tu reseña en la ficha de cada producto.
      </p>
    </section>
  );
}
