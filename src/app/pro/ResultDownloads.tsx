"use client";

import { useRef } from "react";

type MonthlyOutput = {
  month: number;
  productionKwh: number;
  irradiationKwhM2: number;
  variationKwh: number;
};

type DownloadResult = {
  annualProductionKwh: number;
  annualIrradiationKwhM2: number;
  annualVariationKwh: number;
  totalLossPercent: number;
  monthly: MonthlyOutput[];
  horizon: { azimuth: number; height: number }[];
  source: string;
  version: string;
  verifiedAt: string;
  retrievedAt: string;
};

type ResultDownloadsProps = {
  result: DownloadResult | null;
  project: {
    latitude: number;
    longitude: number;
    peakPowerKw: number;
    systemLossPercent: number;
    tilt: string;
    azimuth: string;
    radiationDatabase: string;
  };
};

const DISCLAIMER = "이 결과는 기상 데이터와 모델 가정을 이용한 추정치이며 실제 발전량이나 수익을 보장하지 않습니다.";
const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

/**
 * Palette for exported artefacts.
 *
 * The downloadable SVG and the print document are standalone files — they are
 * opened outside the app and cannot resolve its CSS custom properties, so the
 * values have to be literal here. `accent` mirrors `--sky` in globals.css and
 * must be updated alongside it; the neutrals are a print palette, deliberately
 * darker than the on-screen one so charts stay legible on paper.
 */
const EXPORT_PALETTE = {
  accent: "#0096f7",
  ink: "#111827",
  inkSoft: "#4b5563",
  inkFaint: "#6b7280",
  rule: "#d1d5db",
  hairline: "#e5e7eb",
  wash: "#f3f4f6",
  paper: "#ffffff",
} as const;

function safeFileStamp(value: string) {
  return value.replace(/[:.]/g, "-");
}

function downloadBlob(content: BlobPart, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: string | number) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function buildResultCsv(result: DownloadResult, project: ResultDownloadsProps["project"]) {
  const rows: Array<Array<string | number>> = [
    ["SolPlanit 전문가용 PVGIS 결과"],
    ["출처", `${result.source} ${result.version}`],
    ["출처 검증일", result.verifiedAt],
    ["조회 시각", result.retrievedAt],
    ["위도", project.latitude],
    ["경도", project.longitude],
    ["설치 용량(kWp)", project.peakPowerKw],
    ["입력 손실(%)", project.systemLossPercent],
    ["경사", project.tilt],
    ["방위", project.azimuth],
    ["복사 데이터베이스", project.radiationDatabase],
    ["연간 발전량(kWh)", result.annualProductionKwh],
    ["연간 경사면 일사량(kWh/m²)", result.annualIrradiationKwhM2],
    ["연간 변동성(kWh)", result.annualVariationKwh],
    ["PVGIS 계산 총손실(%)", result.totalLossPercent],
    ["면책", DISCLAIMER],
    [],
    ["월", "발전량(kWh)", "경사면 일사량(kWh/m²)", "표준편차(kWh)"],
    ...result.monthly.map((item) => [MONTHS[item.month - 1] ?? item.month, item.productionKwh, item.irradiationKwhM2, item.variationKwh]),
  ];
  return `\uFEFF${rows.map((row) => row.map(escapeCsv).join(",")).join("\n")}`;
}

export function buildResultJson(result: DownloadResult, project: ResultDownloadsProps["project"]) {
  return JSON.stringify({
    schemaVersion: "1.0",
    generatedBy: "SolPlanit",
    project,
    result,
    disclaimer: DISCLAIMER,
  }, null, 2);
}

function chartSvg(result: DownloadResult) {
  const width = 1200;
  const height = 700;
  const chartTop = 180;
  const chartBottom = 570;
  const max = Math.max(...result.monthly.map((item) => item.productionKwh), 1);
  const bars = result.monthly.map((item, index) => {
    const barWidth = 62;
    const gap = 28;
    const x = 64 + index * (barWidth + gap);
    const barHeight = Math.max(4, item.productionKwh / max * (chartBottom - chartTop));
    const y = chartBottom - barHeight;
    return `<g><rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="8" fill="${EXPORT_PALETTE.accent}"/><text x="${x + barWidth / 2}" y="${y - 12}" text-anchor="middle" font-size="18" fill="${EXPORT_PALETTE.ink}">${Math.round(item.productionKwh).toLocaleString("ko-KR")}</text><text x="${x + barWidth / 2}" y="${chartBottom + 34}" text-anchor="middle" font-size="18" fill="${EXPORT_PALETTE.inkSoft}">${MONTHS[item.month - 1]}</text></g>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="${EXPORT_PALETTE.paper}"/><text x="64" y="70" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="${EXPORT_PALETTE.ink}">SolPlanit 월별 발전량</text><text x="64" y="112" font-family="Arial, sans-serif" font-size="20" fill="${EXPORT_PALETTE.inkSoft}">${result.source} ${result.version} · 연간 ${Math.round(result.annualProductionKwh).toLocaleString("ko-KR")} kWh</text><line x1="64" y1="${chartBottom}" x2="1140" y2="${chartBottom}" stroke="${EXPORT_PALETTE.rule}"/>${bars}<text x="64" y="652" font-family="Arial, sans-serif" font-size="16" fill="${EXPORT_PALETTE.inkFaint}">${DISCLAIMER}</text></svg>`;
}

export default function ResultDownloads({ result, project }: ResultDownloadsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const disabled = !result;
  const filenameBase = result ? `solplanit-pvgis-${safeFileStamp(result.retrievedAt)}` : "solplanit-pvgis-result";

  function downloadCsv() {
    if (!result) return;
    downloadBlob(buildResultCsv(result, project), "text/csv;charset=utf-8", `${filenameBase}.csv`);
  }

  function downloadJson() {
    if (!result) return;
    downloadBlob(buildResultJson(result, project), "application/json;charset=utf-8", `${filenameBase}.json`);
  }

  function downloadChart() {
    if (!result) return;
    const svg = chartSvg(result);
    const image = new Image();
    const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = 1200;
      canvas.height = 700;
      const context = canvas.getContext("2d");
      context?.drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) downloadBlob(blob, "image/png", `${filenameBase}-monthly.png`);
        URL.revokeObjectURL(svgUrl);
      }, "image/png");
    };
    image.src = svgUrl;
  }

  function printPdf() {
    if (!result) return;
    const report = window.open("", "_blank", "noopener,noreferrer");
    if (!report) return;
    const monthlyRows = result.monthly.map((item) => `<tr><th>${MONTHS[item.month - 1]}</th><td>${item.productionKwh.toLocaleString("ko-KR")}</td><td>${item.irradiationKwhM2.toLocaleString("ko-KR")}</td><td>${item.variationKwh.toLocaleString("ko-KR")}</td></tr>`).join("");
    report.document.write(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>SolPlanit PVGIS 보고서</title><style>body{font-family:Arial,sans-serif;color:${EXPORT_PALETTE.ink};margin:40px}header{border-bottom:3px solid ${EXPORT_PALETTE.ink};padding-bottom:18px}h1{margin:4px 0}.meta,.summary{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin:24px 0}.card{border:1px solid ${EXPORT_PALETTE.rule};border-radius:12px;padding:16px}.card strong{display:block;font-size:24px;margin-top:6px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border-bottom:1px solid ${EXPORT_PALETTE.hairline};padding:9px;text-align:right}th:first-child{text-align:left}.notice{margin-top:24px;padding:16px;background:${EXPORT_PALETTE.wash};border-radius:10px;font-size:13px}@media print{button{display:none}}</style></head><body><header><small>SolPlanit 전문가용</small><h1>태양광 발전량 분석 보고서</h1><p>${result.source} ${result.version} · 검증일 ${result.verifiedAt}</p></header><section class="meta"><div class="card">위치<strong>${project.latitude}, ${project.longitude}</strong></div><div class="card">설치 용량<strong>${project.peakPowerKw} kWp</strong></div><div class="card">경사 / 방위<strong>${project.tilt} / ${project.azimuth}</strong></div><div class="card">조회 시각<strong>${new Date(result.retrievedAt).toLocaleString("ko-KR")}</strong></div></section><section class="summary"><div class="card">연간 발전량<strong>${Math.round(result.annualProductionKwh).toLocaleString("ko-KR")} kWh</strong></div><div class="card">연간 일사량<strong>${Math.round(result.annualIrradiationKwhM2).toLocaleString("ko-KR")} kWh/m²</strong></div><div class="card">연간 변동성<strong>± ${Math.round(result.annualVariationKwh).toLocaleString("ko-KR")} kWh</strong></div><div class="card">PVGIS 계산 총손실<strong>${result.totalLossPercent.toLocaleString("ko-KR")} %</strong></div></section><h2>월별 상세</h2><table><thead><tr><th>월</th><th>발전량(kWh)</th><th>일사량(kWh/m²)</th><th>표준편차(kWh)</th></tr></thead><tbody>${monthlyRows}</tbody></table><p class="notice">${DISCLAIMER}<br>출처: ${result.source} ${result.version} · 복사 데이터베이스: ${project.radiationDatabase}</p><script>window.onload=()=>window.print()</script></body></html>`);
    report.document.close();
  }

  return <div className="resultDownloadActions" aria-label="결과 다운로드 형식">
    <button type="button" className="ghostButton" disabled={disabled} onClick={downloadCsv}>CSV</button>
    <button type="button" className="ghostButton" disabled={disabled} onClick={downloadJson}>JSON</button>
    <button type="button" className="ghostButton" disabled={disabled} onClick={downloadChart}>차트 이미지</button>
    <button type="button" className="darkButton" disabled={disabled} onClick={printPdf}>PDF 보고서</button>
    <canvas ref={canvasRef} hidden aria-hidden="true" />
  </div>;
}
