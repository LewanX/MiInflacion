"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/shared/category-icon";

interface CategoryBar {
  label: string;
  icon: string;
  value: number;
  isUser?: boolean;
}

interface CategoryBarsProps {
  bars: CategoryBar[];
  animate?: boolean;
}

export function CategoryBars({ bars, animate = true }: CategoryBarsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maxValue = Math.max(...bars.map((b) => Math.abs(b.value)), 1);

  useEffect(() => {
    if (!animate || !containerRef.current) return;

    const barEls = containerRef.current.querySelectorAll("[data-bar]");
    gsap.fromTo(
      barEls,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        transformOrigin: "left center",
      }
    );
  }, [bars, animate]);

  return (
    <div ref={containerRef} className="flex flex-col gap-2.5">
      {bars.map((bar) => (
        <div key={bar.label} className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <CategoryIcon
                icon={bar.icon}
                className={cn(
                  "size-3.5",
                  bar.isUser ? "text-destructive" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-xs",
                  bar.isUser
                    ? "font-semibold text-destructive"
                    : "text-muted-foreground"
                )}
              >
                {bar.label}
              </span>
            </div>
            <span
              className={cn(
                "font-mono text-xs tabular-nums",
                bar.isUser ? "text-destructive font-semibold" : "text-foreground"
              )}
            >
              +{bar.value.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div
              data-bar
              className={cn(
                "h-full rounded-full",
                bar.isUser ? "bg-destructive" : "bg-muted-foreground/50"
              )}
              style={{ width: `${(Math.abs(bar.value) / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
