import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdConsentProvider from "@/components/AdConsentProvider";
import SiteFooter from "@/components/SiteFooter";
import { getSearchVerificationConfig } from "@/lib/searchVerification";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";
import "./trust/trust.css";

const searchVerification = getSearchVerificationConfig();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "태양광 설치 계산부터 견적까지 | SolPlanit",
    template: "%s | SolPlanit",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "태양광 설치",
  verification: {
    ...(searchVerification.google ? { google: searchVerification.google } : {}),
    ...(searchVerification.naver
      ? { other: { "naver-site-verification": searchVerification.naver } }
      : {}),
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: SITE_NAME,
    title: "태양광 설치, 처음부터 끝까지 한 번에 | SolPlanit",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "태양광 설치, 처음부터 끝까지 한 번에 | SolPlanit",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "ko-KR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <AdConsentProvider>
          {children}
          <SiteFooter />
        </AdConsentProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
