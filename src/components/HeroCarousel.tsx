"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    id: "nobrand",
    image: "/products/banner-nobrand.png",
    eyebrow: "Nobrand",
    title: "Ropa deportiva seamless para tu día a día",
    href: "/productos?categoria=ropa-mujer",
    cta: "Ver ropa mujer",
  },
  {
    id: "owfit",
    image: "/products/banner-owfit.png",
    eyebrow: "OWfit",
    title: "Nueva colección deportiva femenina",
    href: "/productos?categoria=ropa-mujer",
    cta: "Ver ropa mujer",
  },
  {
    id: "colombian-gymwear",
    image: "/products/banner-colombiangymwear.jpg",
    eyebrow: "Colombian Gymwear",
    title: "Gymwear de alto impacto",
    href: "/productos?categoria=ropa-mujer",
    cta: "Ver ropa mujer",
  },
  {
    id: "mindfuel",
    image: "/products/mindfuel.png",
    eyebrow: "Mindfuel",
    title: "Enfoque y energía todos los días",
    href: "/productos?categoria=salud-y-cuidado-personal",
    cta: "Ver salud y cuidado personal",
  },
  {
    id: "soma",
    image: "/soma/soma-sculpt.webp",
    eyebrow: "SOMA",
    title: "Esculpe tu cuerpo desde adentro",
    href: "/productos?categoria=salud-y-cuidado-personal",
    cta: "Ver salud y cuidado personal",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[440px] w-full overflow-hidden sm:h-[520px]">
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
          <div className="relative flex h-full flex-col items-center justify-end px-4 pb-16 text-center text-white sm:pb-20">
            <div className="text-xs font-semibold uppercase tracking-widest text-white/80">
              {slide.eyebrow}
            </div>
            <h2 className="mt-2 max-w-2xl text-3xl font-bold sm:text-5xl">
              {slide.title}
            </h2>
            <Link
              href={slide.href}
              className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              {slide.cta}
            </Link>
          </div>
        </div>
      ))}

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setIndex(i)}
            aria-label={`Ir al banner ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
