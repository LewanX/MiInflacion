import type { Metadata } from "next";
import { fetchIPCData } from "@/lib/indec";
import { SalaryCalculator } from "@/components/calculator/salary-calculator";

export const metadata: Metadata = {
  title: "Mi Sueldo — ¿Cuánto deberías cobrar?",
  description:
    "Ingresá tu sueldo y descubrí cuánto deberías estar cobrando ajustado por inflación. Datos oficiales del INDEC.",
  alternates: {
    canonical: "/sueldo",
  },
};

export default async function SueldoPage() {
  const data = await fetchIPCData();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <SalaryCalculator
        nivelGeneral={data.nivelGeneral}
        categorias={data.categorias}
      />
    </div>
  );
}
