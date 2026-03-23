import type { Metadata } from "next";
import { fetchIPCData } from "@/lib/indec";
import { CategoriasView } from "@/components/categorias/categorias-view";

export const metadata: Metadata = {
  title: "Categorías — Inflación por rubro",
  description:
    "Inflación desglosada por categoría: alimentos, vivienda, transporte, salud y más. Datos oficiales del INDEC.",
  alternates: {
    canonical: "/categorias",
  },
};

export default async function CategoriasPage() {
  const data = await fetchIPCData();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <CategoriasView
        nivelGeneral={data.nivelGeneral}
        categorias={data.categorias}
      />
    </div>
  );
}
