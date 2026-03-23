import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MiInflación — Calculadora de inflación Argentina",
    short_name: "MiInflación",
    description:
      "Calculá la inflación acumulada y descubrí cuánto deberías cobrar. Datos oficiales del INDEC.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      {
        src: "/img/Logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/img/Logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
