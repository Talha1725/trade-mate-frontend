import type { TradingCalendarTileTone } from "@/types/trading-calendar-card";

export const TRADING_CALENDAR_WEEKDAYS = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
] as const;

export const TRADING_CALENDAR_TILE_BACKGROUNDS: Record<
  TradingCalendarTileTone,
  string
> = {
  "win-dark":
    "linear-gradient(180deg, rgba(12, 233, 160, 0.3) 0%, rgba(16, 137, 97, 0.3) 100%), radial-gradient(52.13% 193.91% at 47.87% 100%, rgba(16, 137, 97, 0.15) 0%, rgba(15, 23, 42, 0.06) 100%)",
  "win-light":
    "linear-gradient(180deg, rgba(12, 233, 160, 0.6) 0%, rgba(16, 137, 97, 0.6) 100%), radial-gradient(52.13% 193.91% at 47.87% 100%, rgba(16, 137, 97, 0.3) 0%, rgba(15, 23, 42, 0.12) 100%)",
  "loss-dark":
    "linear-gradient(180deg, rgba(239, 68, 68, 0.3) 0%, rgba(152, 0, 0, 0.3) 100%), radial-gradient(52.13% 193.91% at 47.87% 100%, rgba(239, 68, 68, 0.15) 0%, rgba(15, 23, 42, 0.06) 100%)",
  "loss-light":
    "linear-gradient(180deg, rgba(239, 68, 68, 0.6) 0%, rgba(152, 0, 0, 0.6) 100%), radial-gradient(52.13% 193.91% at 47.87% 100%, rgba(239, 68, 68, 0.3) 0%, rgba(15, 23, 42, 0.12) 100%)",
  "neutral-dark":
    "linear-gradient(180deg, rgba(82, 82, 91, 0.42) 0%, rgba(39, 39, 42, 0.52) 100%), radial-gradient(52.13% 193.91% at 47.87% 100%, rgba(63, 63, 70, 0.24) 0%, rgba(15, 23, 42, 0.08) 100%)",
  "neutral-light":
    "linear-gradient(180deg, rgba(113, 113, 122, 0.5) 0%, rgba(63, 63, 70, 0.62) 100%), radial-gradient(52.13% 193.91% at 47.87% 100%, rgba(82, 82, 91, 0.3) 0%, rgba(15, 23, 42, 0.1) 100%)",
};
