import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MiInflación — Calculadora de inflación Argentina en tiempo real",
    template: "%s | MiInflación",
  },
  description:
    "Calculá la inflación acumulada y descubrí cuánto deberías cobrar. Datos oficiales del INDEC, actualizados automáticamente.",
  metadataBase: new URL("https://miinflacion.vercel.app"),
  icons: {
    icon: "/img/Logo.png",
    apple: "/img/Logo.png",
  },
  openGraph: {
    title: "MiInflación — ¿Cuánto deberías estar cobrando?",
    description:
      "Tu sueldo vs la inflación real. Datos oficiales del INDEC.",
    type: "website",
    locale: "es_AR",
    images: [{ url: "/img/Logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MiInflación — ¿Cuánto deberías estar cobrando?",
    description:
      "Tu sueldo vs la inflación real. Datos oficiales del INDEC.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${GeistSans.variable} ${GeistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
