import { describe, expect, it } from "vitest";
import { normalizePoint } from "./maplibre";

describe("normalizePoint", () => {
  it("rounds coordinates to six decimal places", () => {
    expect(normalizePoint({ latitude: 37.12345678, longitude: 127.98765432 })).toEqual({
      latitude: 37.123457,
      longitude: 127.987654,
    });
  });

  it("clamps coordinates to valid geographic boundaries", () => {
    expect(normalizePoint({ latitude: 120, longitude: -240 })).toEqual({
      latitude: 90,
      longitude: -180,
    });
  });
});
