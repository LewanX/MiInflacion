"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoTooltipProps {
  text: string;
  className?: string;
}

export function InfoTooltip({ text, className }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY - 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [open]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <button
        ref={btnRef}
        type="button"
        className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen(!open)}
        aria-label="Más información"
      >
        <Info className="size-3.5" />
      </button>
      {open && mounted && createPortal(
        <span
          className="fixed z-[9999] w-56 rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg -translate-x-1/2 pointer-events-none"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          {text}
          <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-border" />
        </span>,
        document.body
      )}
    </span>
  );
}
