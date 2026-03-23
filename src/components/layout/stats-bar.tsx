"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { IPCDataPoint } from "@/lib/types";
import { formatPercent, formatMesAnio } from "@/lib/formatters";

interface StatsBarProps {
  data: IPCDataPoint[];
}

export function StatsBar({ data }: StatsBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const last = data[data.length - 1];

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
    },
    {
      label: "Interanual",
      value: last.variacionInteranual != null ? formatPercent(last.variacionInteranual) : "—",
    },
    {
      label: "Último dato",
      value: formatMesAnio(last.periodo),
    },
  ];

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-3 gap-4"
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          data-stat
          className="rounded-lg border border-border bg-card p-4 text-center"
        >
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            {stat.label}
          </p>
          <p className="text-2xl font-bold font-mono tabular-nums">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
