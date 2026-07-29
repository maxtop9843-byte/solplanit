export const SAVED_WORK_STORAGE_KEY = "solplanit.saved-work.v1";
export const PROFILE_STORAGE_KEY = "solplanit.profile.v1";

export type SavedCalculation = {
  id: string;
  kind: "calculation";
  title: string;
  createdAt: string;
  href: string;
  capacityKw: number;
  panelCount: number;
  annualGenerationKwh: number;
  annualBenefit: number;
  paybackYears: number | null;
  goal: "save" | "sell";
};

export type SavedProject = {
  id: string;
  kind: "project";
  title: string;
  createdAt: string;
  href: string;
};

export type SavedWork = SavedCalculation | SavedProject;

export type LocalProfile = {
  displayName: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function isSavedWork(value: unknown): value is SavedWork {
  if (!isRecord(value)) return false;
  if (typeof value.id !== "string" || typeof value.title !== "string" || typeof value.createdAt !== "string" || typeof value.href !== "string") return false;
  if (value.kind === "project") return true;
  if (value.kind !== "calculation") return false;
  return typeof value.capacityKw === "number" && value.capacityKw > 0 && typeof value.panelCount === "number" && value.panelCount > 0 && typeof value.annualGenerationKwh === "number" && value.annualGenerationKwh >= 0 && typeof value.annualBenefit === "number" && value.annualBenefit >= 0 && (value.paybackYears === null || typeof value.paybackYears === "number") && (value.goal === "save" || value.goal === "sell");
}

export function parseSavedWork(raw: string | null): SavedWork[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedWork).slice(0, 50);
  } catch {
    return [];
  }
}

export function readSavedWork(storage: Pick<Storage, "getItem">): SavedWork[] {
  return parseSavedWork(storage.getItem(SAVED_WORK_STORAGE_KEY));
}

export function writeSavedWork(storage: Pick<Storage, "setItem">, items: SavedWork[]) {
  storage.setItem(SAVED_WORK_STORAGE_KEY, JSON.stringify(items.slice(0, 50)));
}

export function upsertSavedWork(items: SavedWork[], item: SavedWork): SavedWork[] {
  return [item, ...items.filter((candidate) => candidate.id !== item.id)].slice(0, 50);
}

export function removeSavedWork(items: SavedWork[], id: string): SavedWork[] {
  return items.filter((item) => item.id !== id);
}

export function readProfile(storage: Pick<Storage, "getItem">): LocalProfile {
  const raw = storage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return { displayName: "" };
  try {
    const parsed: unknown = JSON.parse(raw);
    return isRecord(parsed) && typeof parsed.displayName === "string" ? { displayName: parsed.displayName.slice(0, 40) } : { displayName: "" };
  } catch {
    return { displayName: "" };
  }
}

export function writeProfile(storage: Pick<Storage, "setItem">, profile: LocalProfile) {
  storage.setItem(PROFILE_STORAGE_KEY, JSON.stringify({ displayName: profile.displayName.trim().slice(0, 40) }));
}
