import { describe, expect, it, vi } from "vitest";
import {
  buildPvgisUrl,
  fetchPvgis,
  PvgisError,
  validatePvgisRequest,
} from "./pvgis";

const validRequest = {
  latitude: 37.5665,
  longitude: 126.978,
  peakPowerKw: 10,
  systemLossPercent: 14,
  tiltDegrees: 30,
  azimuthDegrees: 0,
  mountingPosition: "building" as const,
  moduleTechnology: "crystSi" as const,
};

describe("validatePvgisRequest", () => {
  it("accepts a bounded fixed-system request", () => {
    expect(validatePvgisRequest(validRequest)).toEqual(validRequest);
  });

  it.each([
    [{ ...validRequest, latitude: 91 }, "INVALID_LATITUDE"],
    [{ ...validRequest, longitude: -181 }, "INVALID_LONGITUDE"],
    [{ ...validRequest, peakPowerKw: 0 }, "INVALID_PEAK_POWER"],
    [{ ...validRequest, systemLossPercent: 101 }, "INVALID_LOSS"],
    [{ ...validRequest, tiltDegrees: -1 }, "INVALID_TILT"],
    [{ ...validRequest, azimuthDegrees: 181 }, "INVALID_AZIMUTH"],
  ])("rejects invalid boundaries", (input, code) => {
    expect(() => validatePvgisRequest(input)).toThrowError(
      expect.objectContaining({ code }),
    );
  });
});

describe("buildPvgisUrl", () => {
  it("targets the versioned 5.3 PVcalc endpoint with explicit parameters", () => {
    const url = new URL(buildPvgisUrl(validRequest));

    expect(`${url.origin}${url.pathname}`).toBe("https://re.jrc.ec.europa.eu/api/v5_3/PVcalc");
    expect(url.searchParams.get("lat")).toBe("37.5665");
    expect(url.searchParams.get("lon")).toBe("126.978");
    expect(url.searchParams.get("peakpower")).toBe("10");
    expect(url.searchParams.get("loss")).toBe("14");
    expect(url.searchParams.get("outputformat")).toBe("json");
  });
});

describe("fetchPvgis", () => {
  it("returns source and version metadata with upstream data", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ outputs: { totals: { fixed: { E_y: 12000 } } } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await fetchPvgis(validRequest, fetcher);

    expect(result.source).toBe("PVGIS");
    expect(result.version).toBe("5.3");
    expect(result.verifiedAt).toBe("2026-07-30");
    expect(result.data).toEqual({ outputs: { totals: { fixed: { E_y: 12000 } } } });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("retries a transient upstream failure", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response("busy", { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ outputs: {} }), { status: 200 }));

    await expect(fetchPvgis(validRequest, fetcher)).resolves.toMatchObject({ source: "PVGIS" });
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it("maps a repeated upstream rate limit to a Korean service error", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response("busy", { status: 429 }));

    await expect(fetchPvgis(validRequest, fetcher)).rejects.toEqual(
      expect.objectContaining<PvgisError>({
        code: "PVGIS_RATE_LIMITED",
        status: 503,
      }),
    );
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
});
