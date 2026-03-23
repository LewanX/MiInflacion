import type { IPCDataPoint } from "./types";

/**
 * Get the IPC index of the month BEFORE the given periodo.
 * "a principios de X" = index at end of month X-1.
 * This matches Chequeado's methodology.
 */
function getPreviousIndex(data: IPCDataPoint[], periodo: string): number | null {
  const idx = data.findIndex((d) => d.periodo === periodo);
  if (idx <= 0) return null;
  return data[idx - 1].indice;
}

export function inflacionAcumulada(
  data: IPCDataPoint[],
  periodoDesde: string,
  periodoHasta: string
): number {
  // "a principios de Desde" → use previous month's index as base
  const fromIndex = getPreviousIndex(data, periodoDesde);
  const to = data.find((d) => d.periodo === periodoHasta);
  if (fromIndex == null || !to || fromIndex === 0) return 0;
  return (to.indice / fromIndex - 1) * 100;
}

export function montoAjustado(
  monto: number,
  data: IPCDataPoint[],
  periodoDesde: string,
  periodoHasta: string
): number {
  const fromIndex = getPreviousIndex(data, periodoDesde);
  const to = data.find((d) => d.periodo === periodoHasta);
  if (fromIndex == null || !to || fromIndex === 0) return monto;
  return monto * (to.indice / fromIndex);
}

export function sueldoAjustado(
  sueldoInicial: number,
  data: IPCDataPoint[],
  periodoInicio: string,
  periodoActual: string
): number {
  return montoAjustado(sueldoInicial, data, periodoInicio, periodoActual);
}

export function perdidaPoderAdquisitivo(
  sueldoInicial: number,
  sueldoActual: number,
  data: IPCDataPoint[],
  periodoInicio: string,
  periodoActual: string
): number {
  const ajustado = sueldoAjustado(sueldoInicial, data, periodoInicio, periodoActual);
  if (ajustado === 0) return 0;
  return (1 - sueldoActual / ajustado) * 100;
}

export function buildPeriodo(year: number, month: number): string {
  return `${year}${month.toString().padStart(2, "0")}`;
}

export function getAvailablePeriods(data: IPCDataPoint[]): string[] {
  return data.map((d) => d.periodo);
}

export function getYearRange(data: IPCDataPoint[]): { min: number; max: number } {
  if (data.length === 0) return { min: 2017, max: 2026 };
  return {
    min: data[0].year,
    max: data[data.length - 1].year,
  };
}

export function getAvailableMonths(
  data: IPCDataPoint[],
  year: number
): number[] {
  return data
    .filter((d) => d.year === year)
    .map((d) => d.month);
}
