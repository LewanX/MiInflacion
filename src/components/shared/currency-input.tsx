"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

export function CurrencyInput({ value, onChange, className, id, "aria-label": ariaLabel }: CurrencyInputProps) {
  const [display, setDisplay] = useState(formatDisplay(value));
  const inputRef = useRef<HTMLInputElement>(null);

  function formatDisplay(n: number): string {
    if (n === 0) return "";
    return n.toLocaleString("es-AR");
  }

  function parseDisplay(s: string): number {
    const cleaned = s.replace(/\./g, "").replace(/,/g, "").replace(/\s/g, "");
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 0 : num;
  }

  useEffect(() => {
    setDisplay(formatDisplay(value));
  }, [value]);

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">
        $
      </span>
      <Input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={display}
        placeholder="100.000"
        id={id}
        aria-label={ariaLabel}
        className={`pl-7 font-mono tabular-nums ${className ?? ""}`}
        onFocus={() => {
          if (value === 0) setDisplay("");
        }}
        onChange={(e) => {
          const raw = e.target.value;
          // Only allow digits and dots/commas
          const filtered = raw.replace(/[^\d.,]/g, "");
          setDisplay(filtered);
          const num = parseDisplay(filtered);
          onChange(num);
        }}
        onBlur={() => {
          setDisplay(formatDisplay(value));
        }}
      />
    </div>
  );
}
