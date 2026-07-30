"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getAdPolicyConfig } from "@/lib/adPolicy";
import styles from "./AdConsentProvider.module.css";

export type AdConsentStatus = "pending" | "accepted" | "rejected";

type AdConsentContextValue = {
  status: AdConsentStatus;
  adsEnabled: boolean;
  clientId?: string;
  acceptAds: () => void;
  rejectAds: () => void;
  reopenSettings: () => void;
};

const STORAGE_KEY = "solplanit.ad-consent.v1";

const AdConsentContext = createContext<AdConsentContextValue>({
  status: "rejected",
  adsEnabled: false,
  acceptAds: () => undefined,
  rejectAds: () => undefined,
  reopenSettings: () => undefined,
});

function readStoredConsent(): AdConsentStatus {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "accepted" || stored === "rejected" ? stored : "pending";
  } catch {
    return "pending";
  }
}

function persistConsent(status: Exclude<AdConsentStatus, "pending">) {
  try {
    window.localStorage.setItem(STORAGE_KEY, status);
  } catch {
    // A blocked storage API must not prevent the user from choosing for this page view.
  }
}

export function useAdConsent() {
  return useContext(AdConsentContext);
}

export default function AdConsentProvider({ children }: { children: ReactNode }) {
  const { clientId: adsenseClient, advertisingConfigured } = getAdPolicyConfig();
  const [status, setStatus] = useState<AdConsentStatus>(
    advertisingConfigured ? "pending" : "rejected",
  );

  useEffect(() => {
    if (!advertisingConfigured) {
      return;
    }

    queueMicrotask(() => setStatus(readStoredConsent()));
  }, [advertisingConfigured]);

  useEffect(() => {
    if (status !== "accepted" || !advertisingConfigured || !adsenseClient) {
      return;
    }

    const selector = `script[data-solplanit-adsense="${adsenseClient}"]`;
    if (document.querySelector(selector)) {
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseClient)}`;
    script.dataset.solplanitAdsense = adsenseClient;
    document.head.appendChild(script);
  }, [adsenseClient, advertisingConfigured, status]);

  const acceptAds = useCallback(() => {
    persistConsent("accepted");
    setStatus("accepted");
  }, []);

  const rejectAds = useCallback(() => {
    persistConsent("rejected");
    setStatus("rejected");
  }, []);

  const reopenSettings = useCallback(() => {
    setStatus("pending");
  }, []);

  const value = useMemo<AdConsentContextValue>(
    () => ({
      status,
      adsEnabled: advertisingConfigured && status === "accepted",
      clientId: advertisingConfigured ? adsenseClient : undefined,
      acceptAds,
      rejectAds,
      reopenSettings,
    }),
    [acceptAds, adsenseClient, advertisingConfigured, rejectAds, reopenSettings, status],
  );

  return (
    <AdConsentContext.Provider value={value}>
      {children}
      {advertisingConfigured && status === "pending" ? (
        <section className={styles.banner} aria-label="광고 개인정보 설정">
          <div className={styles.copy}>
            <strong>광고 개인정보 설정</strong>
            <p>
              동의하면 광고 제공을 위해 쿠키와 유사 기술을 사용할 수 있습니다. 거부해도 계산기와
              모든 핵심 기능은 그대로 이용할 수 있습니다.
            </p>
          </div>
          <div className={styles.actions}>
            <button className={styles.secondary} type="button" onClick={rejectAds}>
              광고 거부
            </button>
            <button className={styles.primary} type="button" onClick={acceptAds}>
              광고 동의
            </button>
          </div>
        </section>
      ) : advertisingConfigured ? (
        <button className={styles.settings} type="button" onClick={reopenSettings}>
          광고 설정
        </button>
      ) : null}
    </AdConsentContext.Provider>
  );
}
