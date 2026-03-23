import { MESES } from "./types";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals).replace(".", ",")}%`;
}

export function formatMesAnio(periodo: string): string {
  const year = parseInt(periodo.slice(0, 4), 10);
  const month = parseInt(periodo.slice(4, 6), 10);
  return `${MESES[month - 1]} ${year}`;
}

export function formatMesCorto(month: number): string {
  return MESES[month - 1]?.slice(0, 3) ?? "";
}

export function formatPeriodoRango(desde: string, hasta: string): string {
  return `${formatMesAnio(desde)} → ${formatMesAnio(hasta)}`;
}
