"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  text: string;
  className?: string;
}

export function InfoTooltip({ text, className }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);

  return (
    <span className={cn("relative inline-flex items-center", className)}>
      <button
        type="button"
        className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(!open)}
        aria-label="Más información"
      >
        <Info className="size-3.5" />
      </button>
      {open && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-border" />
        </span>
      )}
    </span>
  );
}
