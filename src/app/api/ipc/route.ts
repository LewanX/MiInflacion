import { NextResponse } from "next/server";
import { fetchIPCData } from "@/lib/indec";

export const revalidate = 86400; // 24 hours

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const codigo = searchParams.get("codigo");

    const data = await fetchIPCData();

    if (codigo) {
      const codigos = codigo.split(",");
      if (codigos.includes("0")) {
        return NextResponse.json({
          nivelGeneral: data.nivelGeneral,
          categorias: data.categorias.filter((c) =>
            codigos.includes(c.codigo)
          ),
          lastUpdate: data.lastUpdate,
          periodoInicial: data.periodoInicial,
          periodoFinal: data.periodoFinal,
        });
      }
      return NextResponse.json({
        nivelGeneral: data.nivelGeneral,
        categorias: data.categorias.filter((c) => codigos.includes(c.codigo)),
        lastUpdate: data.lastUpdate,
        periodoInicial: data.periodoInicial,
        periodoFinal: data.periodoFinal,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching IPC data:", error);
    return NextResponse.json(
      { error: "No se pudieron obtener los datos del INDEC" },
      { status: 500 }
    );
  }
}
