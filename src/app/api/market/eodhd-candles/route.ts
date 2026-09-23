import { NextRequest, NextResponse } from "next/server";

import { ROUTES } from "@/constant/routes";

function backendUrl() {
  const base =
    process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4100/api/v2";
  return base.replace(/\/$/, "");
}

function normalizeInterval(interval: string) {
  switch (interval) {
    case "1m":
      return "M1";
    case "5m":
      return "M5";
    case "15m":
      return "M15";
    case "1h":
    case "1H":
      return "H1";
    case "4h":
    case "4H":
      return "H4";
    case "1d":
    case "D":
      return "D1";
    case "1w":
    case "W":
      return "W1";
    default:
      return interval;
  }
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const timeframe = params.get("timeframe");
  const url = new URL(`${backendUrl()}${ROUTES.MARKET.HISTORY}`);
  url.searchParams.set("symbol", params.get("symbol") ?? "");
  url.searchParams.set("interval", normalizeInterval(timeframe ?? params.get("interval") ?? "D1"));
  url.searchParams.set("limit", params.get("limit") ?? "500");

  const response = await fetch(url, { cache: "no-store" });
  const payload = await response.json();
  return NextResponse.json(payload, { status: response.status });
}
