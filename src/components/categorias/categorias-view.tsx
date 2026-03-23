"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import type { IPCDataPoint, IPCCategory } from "@/lib/types";
import { CATEGORIAS_COICOP } from "@/lib/types";
import {
  inflacionAcumulada,
  buildPeriodo,
  getYearRange,
} from "@/lib/calculations";
import { formatPercent } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/shared/category-icon";
import { PeriodSelector } from "@/components/shared/period-selector";

interface CategoriasViewProps {
  nivelGeneral: IPCDataPoint[];
  categorias: IPCCategory[];
}

export function CategoriasView({
  nivelGeneral,
  categorias,
}: CategoriasViewProps) {
  const { min: minYear, max: maxYear } = getYearRange(nivelGeneral);
  const firstPoint = nivelGeneral[0];
  const lastPoint = nivelGeneral[nivelGeneral.length - 1];

  const [mesDesde, setMesDesde] = useState(1);
  const [anioDesde, setAnioDesde] = useState(Math.max(minYear, maxYear - 1));
  const [mesHasta, setMesHasta] = useState(lastPoint?.month ?? 1);
  const [anioHasta, setAnioHasta] = useState(lastPoint?.year ?? maxYear);

  const barsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );

  const periodoDesde = buildPeriodo(anioDesde, mesDesde);
  const periodoHasta = buildPeriodo(anioHasta, mesHasta);

  // Calculate inflation for all categories + nivel general
  const nivelGeneralInflacion = inflacionAcumulada(
    nivelGeneral,
    periodoDesde,
    periodoHasta
  );

  const categoryData = categorias
    .map((cat) => {
      const inf = inflacionAcumulada(cat.data, periodoDesde, periodoHasta);
      const meta = CATEGORIAS_COICOP[cat.codigo];
      const lastCat = cat.data[cat.data.length - 1];
      return {
        codigo: cat.codigo,
        nombre: meta?.nombre ?? cat.descripcion,
        icon: meta?.icon ?? "BarChart3",
        acumulada: inf,
        mensual: lastCat?.variacionMensual ?? null,
      };
    })
    .sort((a, b) => b.acumulada - a.acumulada);

  const maxAcumulada = Math.max(
    ...categoryData.map((c) => Math.abs(c.acumulada)),
    1
  );

  useEffect(() => {
    if (barsRef.current) {
      const bars = barsRef.current.querySelectorAll("[data-cat-bar]");
      gsap.fromTo(
        bars,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
          transformOrigin: "left center",
        }
      );
    }
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll("[data-cat-card]");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }
      );
    }
  }, [periodoDesde, periodoHasta]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Inflación por categoría
        </h1>
        <p className="text-muted-foreground">
          Desglose del IPC por rubro COICOP. Datos oficiales del INDEC.
        </p>
      </div>

      {/* Period selector */}
      <PeriodSelector
        mesDesde={mesDesde} anioDesde={anioDesde}
        mesHasta={mesHasta} anioHasta={anioHasta}
        years={years}
        onMesDesdeChange={setMesDesde} onAnioDesdeChange={setAnioDesde}
        onMesHastaChange={setMesHasta} onAnioHastaChange={setAnioHasta}
      />

      {/* Ranking bars */}
      <div ref={barsRef} className="space-y-3">
        {/* Nivel general highlight */}
        <div className="flex items-center gap-3 rounded-lg border border-foreground/20 p-3">
          <span className="w-6 text-center text-sm"><CategoryIcon icon="BarChart3" className="size-4" /></span>
          <span className="w-44 truncate text-sm font-semibold">
            Nivel General
          </span>
          <div className="flex-1 h-7 bg-muted/30 rounded overflow-hidden">
            <div
              data-cat-bar
              className="h-full rounded bg-foreground/80"
              style={{
                width: `${(Math.abs(nivelGeneralInflacion) / maxAcumulada) * 100}%`,
              }}
            />
          </div>
          <span className="w-20 text-right font-mono text-sm font-semibold tabular-nums">
            {formatPercent(nivelGeneralInflacion, 0)}
          </span>
        </div>

        {categoryData.map((cat) => (
          <div key={cat.codigo} className="flex items-center gap-3">
            <span className="w-6 text-center text-sm"><CategoryIcon icon={cat.icon} className="size-4 text-muted-foreground" /></span>
            <span className="w-44 truncate text-sm text-muted-foreground">
              {cat.nombre}
            </span>
            <div className="flex-1 h-6 bg-muted/30 rounded overflow-hidden">
              <div
                data-cat-bar
                className="h-full rounded bg-muted-foreground/40"
                style={{
                  width: `${(Math.abs(cat.acumulada) / maxAcumulada) * 100}%`,
                }}
              />
            </div>
            <span className="w-20 text-right font-mono text-sm tabular-nums">
              {formatPercent(cat.acumulada, 0)}
            </span>
          </div>
        ))}
      </div>

      {/* Mini cards grid */}
      <div
        ref={cardsRef}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {categoryData.map((cat) => (
          <Card
            key={cat.codigo}
            data-cat-card
            className={cn(
              "bg-card border-border",
              cat.codigo === categoryData[0]?.codigo &&
                "border-destructive/30"
            )}
            style={{ opacity: 0 }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CategoryIcon icon={cat.icon} className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium truncate">
                  {cat.nombre}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Mensual</p>
                  <p className="font-mono tabular-nums">
                    {cat.mensual != null ? formatPercent(cat.mensual) : "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Acumulada</p>
                  <p className="font-mono tabular-nums font-semibold">
                    {formatPercent(cat.acumulada, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
