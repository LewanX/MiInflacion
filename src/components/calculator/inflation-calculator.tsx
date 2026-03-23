"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import gsap from "gsap";
import type { IPCDataPoint } from "@/lib/types";
import { MESES } from "@/lib/types";
import {
  inflacionAcumulada,
  montoAjustado,
  buildPeriodo,
  getYearRange,
  getAvailableMonths,
} from "@/lib/calculations";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CurrencyInput } from "@/components/shared/currency-input";
import { InfoTooltip } from "@/components/shared/info-tooltip";
import { ShareButtons } from "@/components/shared/share-buttons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface InflationCalculatorProps {
  data: IPCDataPoint[];
}

export function InflationCalculator({ data }: InflationCalculatorProps) {
  const { min: minYear, max: maxYear } = getYearRange(data);
  const lastPoint = data[data.length - 1];

  const firstPoint = data[0];

  const [monto, setMonto] = useState(100000);
  const [mesDesde, setMesDesde] = useState(firstPoint?.month ?? 1);
  const [anioDesde, setAnioDesde] = useState(Math.max(minYear, maxYear - 2));
  const [mesHasta, setMesHasta] = useState(lastPoint?.month ?? 1);
  const [anioHasta, setAnioHasta] = useState(lastPoint?.year ?? maxYear);

  const resultRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const periodoDesde = buildPeriodo(anioDesde, mesDesde);
  const periodoHasta = buildPeriodo(anioHasta, mesHasta);

  const inflacion = inflacionAcumulada(data, periodoDesde, periodoHasta);
  const ajustado = montoAjustado(monto, data, periodoDesde, periodoHasta);

  const mesesDesdeDisponibles = getAvailableMonths(data, anioDesde);
  const mesesHastaDisponibles = getAvailableMonths(data, anioHasta);

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );

  const animateResult = useCallback(() => {
    if (badgeRef.current) {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, []);

  useEffect(() => {
    animateResult();
  }, [inflacion, animateResult]);

  const isValid =
    periodoDesde <= periodoHasta &&
    data.some((d) => d.periodo === periodoDesde) &&
    data.some((d) => d.periodo === periodoHasta);

  return (
    <Card ref={cardRef} className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl">Calculadora de inflación</CardTitle>
          <InfoTooltip text="Calculá cuánto necesitarías hoy para comprar lo mismo que comprabas antes. Usa el IPC oficial del INDEC." />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">
            Monto
          </label>
          <CurrencyInput value={monto} onChange={setMonto} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">
              Desde
            </label>
            <div className="flex gap-2">
              <Select
                value={String(mesDesde)}
                onValueChange={(v) => setMesDesde(Number(v))}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESES.map((mes, i) => (
                    <SelectItem
                      key={i}
                      value={String(i + 1)}
                      disabled={!mesesDesdeDisponibles.includes(i + 1)}
                    >
                      {mes.slice(0, 3)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={String(anioDesde)}
                onValueChange={(v) => setAnioDesde(Number(v))}
              >
                <SelectTrigger className="w-24">
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
              Hasta
            </label>
            <div className="flex gap-2">
              <Select
                value={String(mesHasta)}
                onValueChange={(v) => setMesHasta(Number(v))}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESES.map((mes, i) => (
                    <SelectItem
                      key={i}
                      value={String(i + 1)}
                      disabled={!mesesHastaDisponibles.includes(i + 1)}
                    >
                      {mes.slice(0, 3)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={String(anioHasta)}
                onValueChange={(v) => setAnioHasta(Number(v))}
              >
                <SelectTrigger className="w-24">
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
        </div>

        {isValid ? (
          <div ref={resultRef} className="space-y-3 pt-2">
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">Necesitarías</p>
              <p className="text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight break-all">
                {formatCurrency(ajustado)}
              </p>
            </div>
            <div ref={badgeRef} className="flex items-center gap-1.5">
              <Badge variant="secondary" className="font-mono tabular-nums">
                Inflación acumulada: {formatPercent(inflacion)}
              </Badge>
              <InfoTooltip text="Porcentaje total que subieron los precios entre las dos fechas seleccionadas." />
            </div>
            <ShareButtons
              captureRef={cardRef}
              text={`Lo que costaba ${formatCurrency(monto)} ahora cuesta ${formatCurrency(ajustado)}. La inflación acumulada fue de ${formatPercent(inflacion)}.\n\nCalculá la tuya en miinflacion.ar`}
            />
          </div>
        ) : (
          <p className="text-sm text-destructive pt-2">
            Seleccioná un período válido
          </p>
        )}
      </CardContent>
    </Card>
  );
}
