"use client";

import { useCallback, useState } from "react";
import html2canvas from "html2canvas-pro";
import { Button, buttonVariants } from "@/components/ui/button";
import { Copy, Share2, Download, Check } from "lucide-react";

interface ShareButtonsProps {
  /** Ref to the DOM element to capture as image */
  captureRef: React.RefObject<HTMLDivElement | null>;
  /** Plain text to share */
  text: string;
  /** Watermark text on image */
  watermark?: string;
}

export function ShareButtons({ captureRef, text, watermark = "miinflacion.ar" }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const captureImage = useCallback(async (): Promise<Blob | null> => {
    if (!captureRef.current) return null;
    setGenerating(true);

    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: "#09090B",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      // Add watermark
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.font = "14px monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.textAlign = "right";
        ctx.fillText(watermark, canvas.width - 20, canvas.height - 15);
      }

      return new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/png");
      });
    } catch {
      return null;
    } finally {
      setGenerating(false);
    }
  }, [captureRef, watermark]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWithImage = async () => {
    const blob = await captureImage();
    if (!blob) return;

    const file = new File([blob], "miinflacion.png", { type: "image/png" });

    // Try native share (works on mobile)
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        text,
        files: [file],
      });
      return;
    }

    // Fallback: open WhatsApp with text + download image
    downloadImage(blob);
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  const handleDownload = async () => {
    const blob = await captureImage();
    if (blob) downloadImage(blob);
  };

  function downloadImage(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "miinflacion.png";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? "Copiado" : "Copiar"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleShareWithImage}
        disabled={generating}
      >
        <Share2 className="size-3.5" />
        {generating ? "Generando..." : "Compartir"}
      </Button>
      <Button variant="outline" size="sm" onClick={handleDownload} disabled={generating}>
        <Download className="size-3.5" />
        Descargar imagen
      </Button>
      <a
        className={buttonVariants({ variant: "outline", size: "sm" })}
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Twitter
      </a>
    </div>
  );
}
