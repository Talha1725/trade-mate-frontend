import type {
  TradingCalendarDay,
  TradingCalendarTileTone,
} from "@/types/trading-calendar-card";

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
};

export const mockTradingCalendarDays: TradingCalendarDay[] = [
  { id: "d-1", day: 1, tone: "loss", intensity: "dark" },
  { id: "d-2", day: 2, tone: "win", intensity: "dark" },
  { id: "d-3", day: 3, tone: "loss", intensity: "light" },
  { id: "d-4", day: 4, tone: "win", intensity: "light" },
  { id: "d-5", day: 5, tone: "win", intensity: "light" },
  { id: "d-6", day: 6, tone: "loss", intensity: "light" },
  { id: "d-7", day: 7, tone: "win", intensity: "dark" },
  { id: "d-8", day: 8, tone: "win", intensity: "dark" },
  { id: "d-9", day: 9, tone: "loss", intensity: "dark" },
  { id: "d-10", day: 10, tone: "win", intensity: "light" },
  { id: "d-11", day: 11, tone: "win", intensity: "dark" },
  { id: "d-12", day: 12, tone: "loss", intensity: "light" },
  { id: "d-13", day: 13, tone: "win", intensity: "light" },
  { id: "d-14", day: 14, tone: "loss", intensity: "dark" },
  { id: "d-15", day: 15, tone: "win", intensity: "dark" },
  { id: "d-16", day: 16, tone: "win", intensity: "light" },
  { id: "d-17", day: 17, tone: "loss", intensity: "light" },
  { id: "d-18", day: 18, tone: "win", intensity: "dark" },
  { id: "d-19", day: 19, tone: "win", intensity: "light" },
  { id: "d-20", day: 20, tone: "loss", intensity: "light" },
  { id: "d-21", day: 21, tone: "win", intensity: "dark" },
  { id: "d-22", day: 22, tone: "win", intensity: "light" },
  { id: "d-23", day: 23, tone: "loss", intensity: "light" },
  { id: "d-24", day: 24, tone: "win", intensity: "dark" },
  { id: "d-25", day: 25, tone: "loss", intensity: "dark" },
  { id: "d-26", day: 26, tone: "win", intensity: "light" },
  { id: "d-27", day: 27, tone: "win", intensity: "dark" },
  { id: "d-28", day: 28, tone: "loss", intensity: "light" },
  { id: "d-29", day: 29, tone: "win", intensity: "light" },
  { id: "d-30", day: 30, tone: "win", intensity: "dark" },
  { id: "d-31", day: 31, tone: "loss", intensity: "light" },
  { id: "d-next-1", day: 1, tone: "win", intensity: "dark", isOutsideMonth: true },
  { id: "d-next-2", day: 2, tone: "win", intensity: "light", isOutsideMonth: true },
  { id: "d-next-3", day: 3, tone: "loss", intensity: "light", isOutsideMonth: true },
  { id: "d-next-4", day: 4, tone: "win", intensity: "dark", isOutsideMonth: true },
];
