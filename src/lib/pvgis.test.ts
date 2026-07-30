import { describe, expect, it, vi } from "vitest";
import {
  buildPvgisUrl,
  fetchPvgis,
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
  useHorizon: true,
  radiationDatabase: "PVGIS-SARAH3" as const,
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
    [{ ...validRequest, useHorizon: "yes" }, "INVALID_HORIZON"],
    [{ ...validRequest, radiationDatabase: "PVGIS-CMSAF" }, "INVALID_RADIATION_DATABASE"],
  ])("rejects invalid boundaries and unsupported PVGIS options", (input, code) => {
    expect(() => validatePvgisRequest(input)).toThrowError(
      expect.objectContaining({ code }),
    );
  });
});

describe("buildPvgisUrl", () => {
  it("targets the versioned 5.3 PVcalc endpoint with explicit fixed-system parameters", () => {
    const url = new URL(buildPvgisUrl(validRequest));

    expect(`${url.origin}${url.pathname}`).toBe("https://re.jrc.ec.europa.eu/api/v5_3/PVcalc");
    expect(url.searchParams.get("lat")).toBe("37.5665");
    expect(url.searchParams.get("lon")).toBe("126.978");
    expect(url.searchParams.get("peakpower")).toBe("10");
    expect(url.searchParams.get("loss")).toBe("14");
    expect(url.searchParams.get("angle")).toBe("30");
    expect(url.searchParams.get("aspect")).toBe("0");
    expect(url.searchParams.get("mountingplace")).toBe("building");
    expect(url.searchParams.get("pvtechchoice")).toBe("crystSi");
    expect(url.searchParams.get("usehorizon")).toBe("1");
    expect(url.searchParams.get("raddatabase")).toBe("PVGIS-SARAH3");
    expect(url.searchParams.get("outputformat")).toBe("json");
  });

  it("maps missing tilt and azimuth to the PVGIS optimal-angles option", () => {
    const url = new URL(buildPvgisUrl({
      ...validRequest,
      tiltDegrees: undefined,
      azimuthDegrees: undefined,
    }));

    expect(url.searchParams.get("optimalangles")).toBe("1");
    expect(url.searchParams.has("angle")).toBe(false);
    expect(url.searchParams.has("aspect")).toBe(false);
  });

  it("maps an omitted tilt to optimal inclination while preserving azimuth", () => {
    const url = new URL(buildPvgisUrl({
      ...validRequest,
      tiltDegrees: undefined,
      azimuthDegrees: -20,
      useHorizon: false,
      radiationDatabase: "PVGIS-ERA5",
    }));

    expect(url.searchParams.get("optimalinclination")).toBe("1");
    expect(url.searchParams.get("aspect")).toBe("-20");
    expect(url.searchParams.get("usehorizon")).toBe("0");
    expect(url.searchParams.get("raddatabase")).toBe("PVGIS-ERA5");
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
      expect.objectContaining({
        code: "PVGIS_RATE_LIMITED",
        status: 503,
      }),
    );
    expect(fetcher).toHaveBeenCalledTimes(3);
  });
});
