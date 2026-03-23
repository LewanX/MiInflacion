import { fetchIPCData } from "@/lib/indec";
import { HeroSection } from "@/components/landing/hero-section";
import { StatsBar } from "@/components/layout/stats-bar";
import { InflationCalculator } from "@/components/calculator/inflation-calculator";
import { IPCLineChart } from "@/components/charts/ipc-line-chart";

export default async function HomePage() {
  const data = await fetchIPCData();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-16">
      <HeroSection />

      <StatsBar data={data.nivelGeneral} />

      <div id="calculadora" className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">
            Evolución del IPC
          </h2>
          <IPCLineChart data={data.nivelGeneral} />
          <p className="text-xs text-muted-foreground mt-3">
            Fuente: INDEC. Base diciembre 2016 = 100
          </p>
        </div>
        <InflationCalculator data={data.nivelGeneral} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "¿Cuál es la inflación mensual actual en Argentina?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: `La inflación mensual del último dato disponible es ${data.nivelGeneral[data.nivelGeneral.length - 1]?.variacionMensual ?? "N/A"}%.`,
                },
              },
              {
                "@type": "Question",
                name: "¿Cómo calculo la inflación acumulada?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "La inflación acumulada se calcula dividiendo el índice IPC del período final por el del período inicial, restando 1 y multiplicando por 100.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
