import Image from "next/image";
import { ExternalLink, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Image
            src="/img/Logo.png"
            alt="MiInflación"
            width={28}
            height={28}
            className="invert"
          />
          <span className="font-medium text-foreground">MiInflación</span>
        </div>
        <p>
          Datos oficiales del{" "}
          <a
            href="https://www.indec.gob.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-foreground transition-colors"
          >
            INDEC
            <ExternalLink className="size-3" />
          </a>
          . Actualización automática.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://cafecito.app/ellewan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Heart className="size-3" />
            Bancá este proyecto
          </a>
          <span className="text-border">·</span>
          <span className="font-mono text-xs">miinflacion.vercel.app</span>
        </div>
      </div>
    </footer>
  );
}
