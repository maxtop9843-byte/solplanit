"use client";

import { useEffect, useRef, useState } from "react";
import { useAdConsent } from "./AdConsentProvider";
import styles from "./AdZone.module.css";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

type AdZoneProps = {
  placement: "home-after-process" | "guides-after-list";
  format?: "wide" | "content";
  className?: string;
};

const slots: Record<AdZoneProps["placement"], string | undefined> = {
  "home-after-process": process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_AFTER_PROCESS?.trim(),
  "guides-after-list": process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDES_AFTER_LIST?.trim(),
};

export default function AdZone({ placement, format = "wide", className }: AdZoneProps) {
  const { status, adsEnabled, clientId } = useAdConsent();
  const [isNearViewport, setIsNearViewport] = useState(false);
  const zoneRef = useRef<HTMLElement>(null);
  const requestedRef = useRef(false);
  const slot = slots[placement];
  const canRequestAd = adsEnabled && Boolean(clientId && slot);
  const classes = [styles.zone, styles[format], className].filter(Boolean).join(" ");

  useEffect(() => {
    const node = zoneRef.current;
    if (!node || !canRequestAd) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      queueMicrotask(() => setIsNearViewport(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [canRequestAd]);

  useEffect(() => {
    if (!canRequestAd || !isNearViewport || requestedRef.current) {
      return;
    }

    requestedRef.current = true;
    window.adsbygoogle = window.adsbygoogle ?? [];
    window.adsbygoogle.push({});
  }, [canRequestAd, isNearViewport]);

  const state = !slot || !clientId ? "disabled" : status === "pending" ? "consent-pending" : status === "rejected" ? "blocked" : isNearViewport ? "requested" : "lazy";

  return (
    <aside
      ref={zoneRef}
      className={classes}
      aria-label="광고 영역"
      data-ad-zone={state}
      data-ad-placement={placement}
      data-ad-format={format}
      data-mobile-density="one-per-page"
    >
      <span className={styles.label}>광고</span>
      <div className={styles.canvas}>
        {canRequestAd && isNearViewport ? (
          <ins
            className="adsbygoogle"
            aria-hidden="true"
            data-ad-client={clientId}
            data-ad-slot={slot}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <span className={styles.placeholder} aria-hidden="true" />
        )}
      </div>
    </aside>
  );
}
