"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import type { IPCDataPoint, IPCCategory } from "@/lib/types";
import { MESES, CATEGORIAS_COICOP } from "@/lib/types";
import {
  sueldoAjustado,
  perdidaPoderAdquisitivo,
  inflacionAcumulada,
  buildPeriodo,
  getYearRange,
  getAvailableMonths,
} from "@/lib/calculations";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { CurrencyInput } from "@/components/shared/currency-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryBars } from "@/components/charts/category-bars";
import { ShareButtons } from "@/components/shared/share-buttons";

interface SalaryCalculatorProps {
  nivelGeneral: IPCDataPoint[];
  categorias: IPCCategory[];
}

export function SalaryCalculator({
  nivelGeneral,
  categorias,
}: SalaryCalculatorProps) {
  const { min: minYear, max: maxYear } = getYearRange(nivelGeneral);
  const lastPoint = nivelGeneral[nivelGeneral.length - 1];

  const [sueldoInicial, setSueldoInicial] = useState(500000);
  const [mesInicio, setMesInicio] = useState(1);
  const [anioInicio, setAnioInicio] = useState(2024);
  const [sueldoActual, setSueldoActual] = useState(800000);
  const [calculated, setCalculated] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );
  const mesesDisponibles = getAvailableMonths(nivelGeneral, anioInicio);
  const periodoInicio = buildPeriodo(anioInicio, mesInicio);
  const periodoActual = lastPoint?.periodo ?? buildPeriodo(maxYear, 12);

  const ajustado = sueldoAjustado(sueldoInicial, nivelGeneral, periodoInicio, periodoActual);
  const inflacionPeriodo = inflacionAcumulada(nivelGeneral, periodoInicio, periodoActual);
  const perdida = perdidaPoderAdquisitivo(
    sueldoInicial,
    sueldoActual,
    nivelGeneral,
    periodoInicio,
    periodoActual
  );
  const aumentoReal = (sueldoActual / sueldoInicial - 1) * 100;

  const categoryBars = categorias
    .map((cat) => {
      const inf = inflacionAcumulada(cat.data, periodoInicio, periodoActual);
      const meta = CATEGORIAS_COICOP[cat.codigo];
      return {
        label: meta?.nombre ?? cat.descripcion,
        icon: meta?.icon ?? "BarChart3",
        value: inf,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const allBars = [
    ...categoryBars,
    {
      label: "Tu aumento",
      icon: "Wallet",
      value: aumentoReal,
      isUser: true,
    },
  ];

  // Animate AFTER the result card mounts
  useEffect(() => {
    if (!calculated || !resultCardRef.current || !formRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Slide form to left (only on desktop)
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (isDesktop) {
      tl.to(formRef.current, {
        x: 0,
        duration: 0.4,
      });
    }

    // Slide in results card
    tl.fromTo(
      resultCardRef.current,
      { opacity: 0, x: 60, scale: 0.97 },
      { opacity: 1, x: 0, scale: 1, duration: 0.5 },
      isDesktop ? "-=0.3" : "+=0"
    );

    // Badge pop
    const badge = resultCardRef.current.querySelector("[data-badge]");
    if (badge) {
      tl.fromTo(
        badge,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" },
        "-=0.2"
      );
    }

    // Bars stagger
    const bars = resultCardRef.current.querySelectorAll("[data-bar]");
    if (bars.length > 0) {
      tl.fromTo(
        bars,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, stagger: 0.06, ease: "power2.out", transformOrigin: "left center" },
        "-=0.2"
      );
    }
  }, [calculated, animationKey]);

  function handleCalculate() {
    if (calculated) {
      // Re-trigger animation on subsequent clicks
      setAnimationKey((k) => k + 1);
    } else {
      setCalculated(true);
    }
  }

  return (
    <div ref={containerRef}>
      <div
        className={`grid gap-8 transition-all duration-300 ${
          calculated
            ? "lg:grid-cols-[1fr_1fr]"
            : "max-w-lg mx-auto"
        }`}
      >
        {/* Form */}
        <div ref={formRef} className="space-y-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl">
              ¿Cuánto deberías
              <br />
              <span className="bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-transparent">
                estar cobrando?
              </span>
            </h1>
            <p className="text-sm text-muted-foreground mt-3">
              Compará tu sueldo con la inflación real y descubrí cuánto perdiste.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Sueldo cuando empezaste
              </label>
              <CurrencyInput value={sueldoInicial} onChange={setSueldoInicial} />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                ¿Cuándo empezaste?
              </label>
              <div className="flex gap-2">
                <Select
                  value={String(mesInicio)}
                  onValueChange={(v) => setMesInicio(Number(v))}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MESES.map((mes, i) => (
                      <SelectItem
                        key={i}
                        value={String(i + 1)}
                        disabled={!mesesDisponibles.includes(i + 1)}
                      >
                        {mes}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={String(anioInicio)}
                  onValueChange={(v) => setAnioInicio(Number(v))}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">
                Tu sueldo actual
              </label>
              <CurrencyInput value={sueldoActual} onChange={setSueldoActual} />
            </div>

            <Button onClick={handleCalculate} className="w-full" size="lg">
              Calcular
            </Button>
          </div>
        </div>

        {/* Results */}
        {calculated && (
          <div ref={resultCardRef} style={{ opacity: 0 }}>
            <Card className="bg-card border-border">
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-xs text-muted-foreground/60 mb-1">
                    La inflación desde que empezaste fue de {formatPercent(inflacionPeriodo)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Para comprar lo mismo que antes necesitás
                  </p>
                  <p className="text-4xl font-bold font-mono tabular-nums tracking-tight mt-1">
                    {formatCurrency(ajustado)}
                  </p>
                  <p className="text-xs text-muted-foreground/40 mt-1">
                    = tu sueldo inicial ({formatCurrency(sueldoInicial)}) ajustado por inflación
                  </p>
                </div>

                <div data-badge>
                  {perdida > 0 ? (
                    <>
                      <Badge variant="destructive" className="text-sm px-3 py-1">
                        Tu sueldo no alcanzó a cubrir la inflación
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        Necesitarías un aumento de{" "}
                        <span className="font-mono text-destructive">
                          {formatCurrency(ajustado - sueldoActual)}
                        </span>
                        {" "}para recuperar tu poder adquisitivo
                      </p>
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary" className="text-sm px-3 py-1 border-green-500/30 text-green-400">
                        Tu sueldo le ganó a la inflación
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-2">
                        Superás lo necesario por{" "}
                        <span className="font-mono text-green-400">
                          {formatCurrency(sueldoActual - ajustado)}
                        </span>
                      </p>
                    </>
                  )}
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Tu aumento vs inflación por rubro
                  </p>
                  <CategoryBars bars={allBars} />
                </div>

                <ShareButtons
                  captureRef={resultCardRef}
                  text={`Debería cobrar ${formatCurrency(ajustado)} pero cobro ${formatCurrency(sueldoActual)}. Perdí ${formatPercent(perdida)} de poder adquisitivo.\n\nCalculá el tuyo en miinflacion.vercel.app`}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
