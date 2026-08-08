"use client";

import { useState } from "react";
import { readSavedWork, upsertSavedWork, writeSavedWork, type SavedCalculation } from "../lib/account/saved-work";

export default function SaveCalculationButton({ calculation }: { calculation: Omit<SavedCalculation, "id" | "kind" | "title" | "createdAt"> }) {
  const [saved, setSaved] = useState(false);

  function save() {
    const item: SavedCalculation = {
      ...calculation,
      id: `calculation-${calculation.goal}-${calculation.capacityKw}-${calculation.annualGenerationKwh}`,
      kind: "calculation",
      title: `${calculation.capacityKw.toLocaleString("ko-KR")}kW ${calculation.goal === "save" ? "절감" : "발전 수익"} 계산`,
      createdAt: new Date().toISOString(),
    };
    writeSavedWork(window.localStorage, upsertSavedWork(readSavedWork(window.localStorage), item));
    setSaved(true);
  }

  return <button className="secondaryButton" type="button" onClick={save} aria-live="polite">{saved ? "내 작업에 저장됨" : "계산 결과 저장하기"}</button>;
}
