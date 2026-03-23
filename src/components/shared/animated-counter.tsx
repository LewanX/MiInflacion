"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AnimatedCounterProps {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  format = (n) => n.toFixed(0),
  duration = 0.8,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const counterRef = useRef({ val: 0 });

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(counterRef.current, {
      val: value,
      duration,
      ease: "power1.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = format(counterRef.current.val);
        }
      },
    });
  }, [value, duration, format]);

  return <span ref={ref} className={className}>{format(0)}</span>;
}
