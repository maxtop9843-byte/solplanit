"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Drives the hero's sky-to-rooftop transition.
 *
 * The composition is already complete at rest — sky above, panels filling the
 * lower diagonal — so a visitor who never scrolls still sees the whole idea.
 * Scrolling only adds parallax, and it resolves within this one viewport
 * rather than being stretched across the page.
 *
 * Exposes `--hero-progress` (0 → 1) on the section. Under
 * `prefers-reduced-motion` the listener never attaches and the value stays 0.
 */
export default function HeroStage({
  children,
  ...rest
}: {
  children: ReactNode;
  [key: string]: unknown;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const motionQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    let frame = 0;
    let detach: (() => void) | undefined;

    const measure = () => {
      frame = 0;
      const travel = node.offsetHeight || 1;
      const progress = Math.min(Math.max(window.scrollY / travel, 0), 1);
      node.style.setProperty("--hero-progress", progress.toFixed(4));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    const apply = () => {
      detach?.();
      detach = undefined;
      if (!motionQuery || motionQuery.matches) {
        node.style.setProperty("--hero-progress", "0");
        return;
      }
      measure();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      detach = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      };
    };

    apply();
    motionQuery?.addEventListener("change", apply);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      detach?.();
      motionQuery?.removeEventListener("change", apply);
    };
  }, []);

  return (
    <section ref={ref as never} {...rest}>
      {children}
    </section>
  );
}
