export type TradingCalendarDayTone = "win" | "loss";

export type TradingCalendarDayIntensity = "dark" | "light";

export type TradingCalendarDay = {
  id: string;
  day: number;
  tone: TradingCalendarDayTone;
  intensity: TradingCalendarDayIntensity;
  isOutsideMonth?: boolean;
};

export type TradingCalendarTileTone =
  `${TradingCalendarDayTone}-${TradingCalendarDayIntensity}`;

export type TradingCalendarCardProps = {
  title?: string;
  sessionsLabel?: string;
  weekdays?: string[];
  days?: TradingCalendarDay[];
  className?: string;
};
