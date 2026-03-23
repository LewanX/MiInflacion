"use client";

import { useState, useRef, useCallback } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  text: string;
  className?: string;
  side?: "auto" | "top" | "bottom";
}

export function InfoTooltip({ text, className, side = "auto" }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<"top" | "bottom">("top");
  const btnRef = useRef<HTMLButtonElement>(null);

  const updatePosition = useCallback(() => {
    if (side !== "auto") {
      setPos(side);
      return;
    }
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    // Need ~100px above for the tooltip. Check viewport space + parent clipping
    setPos(rect.top < 120 ? "bottom" : "top");
  }, [side]);

  return (
    <span className={cn("relative inline-flex items-center", className)}>
      <button
        ref={btnRef}
        type="button"
        className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        onMouseEnter={() => { updatePosition(); setOpen(true); }}
        onMouseLeave={() => setOpen(false)}
        onClick={() => { updatePosition(); setOpen(!open); }}
        aria-label="Más información"
      >
        <Info className="size-3.5" />
      </button>
      {open && (
        <span
          className={cn(
            "absolute z-[9999] w-52 max-w-[80vw] rounded-lg border border-border bg-zinc-900 px-3 py-2.5 text-xs leading-relaxed text-zinc-200 shadow-xl pointer-events-none",
            pos === "top"
              ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
              : "top-full mt-2 left-0"
          )}
        >
          {text}
        </span>
      )}
    </span>
  );
}
