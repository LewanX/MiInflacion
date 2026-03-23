"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { IPCDataPoint } from "@/lib/types";
import { formatPercent, formatMesAnio } from "@/lib/formatters";
import { InfoTooltip } from "@/components/shared/info-tooltip";
import { cn } from "@/lib/utils";

interface StatsBarProps {
  data: IPCDataPoint[];
}

function DeltaArrow({ current, previous }: { current: number | null; previous: number | null }) {
  if (current == null || previous == null) return null;
  const diff = current - previous;
  if (Math.abs(diff) < 0.05) return <Minus className="size-3 text-muted-foreground" />;
  // For inflation: lower is better → green when decreasing
  if (diff < 0) return <TrendingDown className="size-3 text-green-500" />;
  return <TrendingUp className="size-3 text-red-400" />;
}

export function StatsBar({ data }: StatsBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const last = data[data.length - 1];
  const prev = data.length >= 2 ? data[data.length - 2] : null;

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll("[data-stat]");
    gsap.set(cards, { opacity: 0, y: 20 });
    gsap.to(cards, {
      opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", delay: 0.6,
    });
  }, []);

  if (!last) return null;

  const stats = [
    {
      label: "Mensual",
      value: last.variacionMensual != null ? formatPercent(last.variacionMensual) : "—",
      subtitle: "Vs mes anterior",
      tooltip: "Variación del IPC respecto al mes anterior. Mide cuánto subieron los precios en un solo mes.",
      delta: { current: last.variacionMensual, previous: prev?.variacionMensual ?? null },
    },
    {
      label: "Interanual",
      value: last.variacionInteranual != null ? formatPercent(last.variacionInteranual) : "—",
      subtitle: "Vs mismo mes año anterior",
      tooltip: "Compara los precios de hoy con los del mismo mes del año pasado. Es el indicador más usado en medios.",
      delta: { current: last.variacionInteranual, previous: prev?.variacionInteranual ?? null },
    },
    {
      label: "Último dato",
      value: formatMesAnio(last.periodo),
      subtitle: "Publicado por INDEC",
      tooltip: "Fecha del último dato oficial disponible del Índice de Precios al Consumidor.",
      delta: null,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 gap-3 overflow-visible sm:grid-cols-3 sm:gap-4"
    >
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          data-stat
          className="relative flex items-center gap-4 rounded-lg border border-border bg-card p-4 overflow-visible sm:flex-col sm:text-center sm:gap-1"
          style={{ zIndex: stats.length - index }}
        >
          <div className="flex items-center gap-1 sm:mb-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </p>
            <InfoTooltip side="bottom" text={stat.tooltip} />
          </div>
          <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
            <p className="text-xl font-bold font-mono tabular-nums sm:text-2xl">
              {stat.value}
            </p>
            {stat.delta && (
              <DeltaArrow current={stat.delta.current} previous={stat.delta.previous} />
            )}
          </div>
          <p className="hidden text-[10px] text-muted-foreground/50 sm:block sm:mt-1">
            {stat.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}
