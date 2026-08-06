"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({
  value,
  maximumFractionDigits = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  maximumFractionDigits?: number;
  prefix?: string;
  suffix?: string;
}) {
  const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? value : 0));
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion()) return;
    if (!("IntersectionObserver" in window)) {
      queueMicrotask(() => setDisplay(value));
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          const duration = 900;
          const startedAt = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - startedAt) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(value * eased);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const formatted = display.toLocaleString("ko-KR", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  });

  return (
    <span ref={ref} className="num">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
