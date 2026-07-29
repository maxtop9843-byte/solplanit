import { NextResponse } from "next/server";
import { fetchPvgis, PvgisError, validatePvgisRequest } from "@/lib/pvgis";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = validatePvgisRequest(body);
    const result = await fetchPvgis(input);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: { code: "INVALID_JSON", message: "요청 본문이 올바른 JSON 형식이 아닙니다." } },
        { status: 400 },
      );
    }

    if (error instanceof PvgisError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "분석 요청을 처리하지 못했습니다." } },
      { status: 500 },
    );
  }
}
