import type { IPCDataPoint, IPCCategory, IPCData } from "./types";

const INDEC_CSV_URL =
  "https://www.indec.gob.ar/ftp/cuadros/economia/serie_ipc_divisiones.csv";

interface RawRow {
  codigo: string;
  descripcion: string;
  clasificador: string;
  periodo: string;
  indice: number;
  variacionMensual: number | null;
  variacionInteranual: number | null;
  region: string;
}

function parseDecimal(value: string): number | null {
  if (!value || value.trim() === "" || value.trim() === "NA") return null;
  const normalized = value.replace(",", ".");
  const num = parseFloat(normalized);
  return isNaN(num) ? null : num;
}

function parseCSV(csvText: string): RawRow[] {
  const lines = csvText.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  // Skip header
  return lines.slice(1).map((line) => {
    const cols = line.split(";");
    return {
      codigo: cols[0]?.trim() ?? "",
      descripcion: cols[1]?.trim() ?? "",
      clasificador: cols[2]?.trim() ?? "",
      periodo: cols[3]?.trim() ?? "",
      indice: parseDecimal(cols[4] ?? "") ?? 0,
      variacionMensual: parseDecimal(cols[5] ?? ""),
      variacionInteranual: parseDecimal(cols[6] ?? ""),
      region: cols[7]?.trim() ?? "",
    };
  });
}

function toDataPoint(row: RawRow): IPCDataPoint {
  const year = parseInt(row.periodo.slice(0, 4), 10);
  const month = parseInt(row.periodo.slice(4, 6), 10);
  return {
    periodo: row.periodo,
    year,
    month,
    indice: row.indice,
    variacionMensual: row.variacionMensual,
    variacionInteranual: row.variacionInteranual,
  };
}

export async function fetchIPCData(): Promise<IPCData> {
  const response = await fetch(INDEC_CSV_URL, {
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch INDEC data: ${response.status}`);
  }

  const buffer = await response.arrayBuffer();
  // INDEC uses Latin-1 encoding
  const text = new TextDecoder("latin1").decode(buffer);

  const rows = parseCSV(text);

  // Filter Nacional only
  const nacional = rows.filter((r) => r.region === "Nacional");

  // Group by codigo
  const grouped = new Map<string, RawRow[]>();
  for (const row of nacional) {
    const existing = grouped.get(row.codigo) ?? [];
    existing.push(row);
    grouped.set(row.codigo, existing);
  }

  // Nivel general
  const nivelGeneralRows = grouped.get("0") ?? [];
  const nivelGeneral = nivelGeneralRows
    .map(toDataPoint)
    .sort((a, b) => a.periodo.localeCompare(b.periodo));

  // Categorías COICOP (01-12)
  const categoriaCodigos = [
    "01", "02", "03", "04", "05", "06",
    "07", "08", "09", "10", "11", "12",
  ];

  const categorias: IPCCategory[] = categoriaCodigos
    .filter((c) => grouped.has(c))
    .map((codigo) => {
      const catRows = grouped.get(codigo)!;
      return {
        codigo,
        descripcion: catRows[0]?.descripcion ?? codigo,
        data: catRows
          .map(toDataPoint)
          .sort((a, b) => a.periodo.localeCompare(b.periodo)),
      };
    });

  const periodoFinal = nivelGeneral[nivelGeneral.length - 1]?.periodo ?? "";
  const periodoInicial = nivelGeneral[0]?.periodo ?? "";

  return {
    nivelGeneral,
    categorias,
    lastUpdate: new Date().toISOString(),
    periodoInicial,
    periodoFinal,
  };
}
