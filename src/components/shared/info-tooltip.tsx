"use client";

import { useState, useRef, useCallback } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  text: string;
  className?: string;
}

export function InfoTooltip({ text, className }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<"top" | "bottom">("top");
  const btnRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);

  const updatePosition = useCallback(() => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    // If too close to top, show below instead
    setPos(rect.top < 80 ? "bottom" : "top");
  }, []);

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
          ref={tipRef}
          className={cn(
            "absolute left-1/2 z-[9999] w-48 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg pointer-events-none",
            pos === "top"
              ? "bottom-full mb-2 -translate-x-1/2"
              : "top-full mt-2 -translate-x-1/2"
          )}
        >
          {text}
        </span>
      )}
    </span>
  );
}
