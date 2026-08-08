import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import SiteFooter from "@/components/SiteFooter";
import { getSearchVerificationConfig } from "@/lib/searchVerification";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";
import "./trust/trust.css";

const searchVerification = getSearchVerificationConfig();

// 본문 서체. 가변 폰트라 DESIGN.md 가 요구하는 300/350/450 웨이트를 실제로 지정할 수 있다.
// CDN 을 쓰지 않는다. 첫 방문에 시스템 서체가 보였다 바뀌는 순간이 이 디자인에서 가장 나쁘다.
const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  weight: "45 920",
  style: "normal",
  display: "swap",
  variable: "--font-kr-loaded",
});

// 숫자 전용 서체. next/font 가 빌드 시점에 self-host 하므로 외부 요청이 없다.
const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-num-loaded",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "태양광 설치 가능 용량 계산 | SolPlanit",
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
    title: "태양광 설치 가능 용량 계산 | SolPlanit",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "태양광 설치 가능 용량 계산 | SolPlanit",
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
    <html lang="ko" className={`${pretendard.variable} ${geistMono.variable}`}>
      <body>
        <a className="skipLink" href="#main">본문으로 건너뛰기</a>
        <div id="main" tabIndex={-1}>{children}</div>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
