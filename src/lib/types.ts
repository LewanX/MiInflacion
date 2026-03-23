export interface IPCDataPoint {
  periodo: string;
  year: number;
  month: number;
  indice: number;
  variacionMensual: number | null;
  variacionInteranual: number | null;
}

export interface IPCCategory {
  codigo: string;
  descripcion: string;
  data: IPCDataPoint[];
}

export interface IPCData {
  nivelGeneral: IPCDataPoint[];
  categorias: IPCCategory[];
  lastUpdate: string;
  periodoInicial: string;
  periodoFinal: string;
}

export const CATEGORIAS_COICOP: Record<string, { nombre: string; icon: string }> = {
  "0": { nombre: "Nivel General", icon: "BarChart3" },
  "01": { nombre: "Alimentos y bebidas", icon: "ShoppingCart" },
  "02": { nombre: "Bebidas alcohólicas y tabaco", icon: "Wine" },
  "03": { nombre: "Prendas de vestir y calzado", icon: "Shirt" },
  "04": { nombre: "Vivienda, agua, electricidad, gas", icon: "Home" },
  "05": { nombre: "Equipamiento del hogar", icon: "Armchair" },
  "06": { nombre: "Salud", icon: "Heart" },
  "07": { nombre: "Transporte", icon: "Bus" },
  "08": { nombre: "Comunicación", icon: "Smartphone" },
  "09": { nombre: "Recreación y cultura", icon: "Ticket" },
  "10": { nombre: "Educación", icon: "GraduationCap" },
  "11": { nombre: "Restaurantes y hoteles", icon: "UtensilsCrossed" },
  "12": { nombre: "Bienes y servicios varios", icon: "Tag" },
};

export const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
] as const;
