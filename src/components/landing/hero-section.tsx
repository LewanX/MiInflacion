"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function HeroSection() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    if (headingRef.current) {
      const lines = headingRef.current.querySelectorAll("[data-line]");
      tl.fromTo(
        lines,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 }
      );
    }

    if (subtitleRef.current) {
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        "-=0.2"
      );
    }

    if (ctaRef.current) {
      const buttons = ctaRef.current.querySelectorAll("a, button");
      tl.fromTo(
        buttons,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 },
        "-=0.1"
      );
    }
  }, []);

  return (
    <section className="flex flex-col items-center text-center pt-8 pb-4">
      <h1
        ref={headingRef}
        className="text-5xl font-extrabold tracking-tighter sm:text-6xl lg:text-7xl"
      >
        <span data-line className="block" data-animate>
          Tu inflación,
        </span>
        <span
          data-line
          className="block bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent"
          data-animate
        >
          en tiempo real.
        </span>
      </h1>
      <p
        ref={subtitleRef}
        className="mt-6 max-w-lg text-muted-foreground text-lg"
        data-animate
      >
        Datos oficiales del INDEC. Actualización automática. Sin intermediarios.
      </p>
      <div ref={ctaRef} className="mt-8 flex gap-4 flex-wrap justify-center">
        <a href="#calculadora" className={buttonVariants({ size: "lg" })} data-animate>
          Calcular inflación
        </a>
        <Link href="/sueldo" className={buttonVariants({ variant: "outline", size: "lg" })} data-animate>
          ¿Cuánto deberías cobrar?
        </Link>
      </div>
    </section>
  );
}
