"use client";

import {
  TRADING_CALENDAR_TILE_BACKGROUNDS,
  TRADING_CALENDAR_WEEKDAYS,
} from "@/lib/mock-data/trading-calendar";
import { cn } from "@/lib/utils";
import type {
  TradingCalendarCardProps,
  TradingCalendarDay,
} from "@/types/trading-calendar-card";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function SessionsBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/20 bg-linear-to-b from-white/15 to-white/10 px-3 py-2 text-sm font-medium text-white">
      {label}
    </span>
  );
}

function getTileBackground(day: TradingCalendarDay) {
  if (day.tone === "neutral") {
    return TRADING_CALENDAR_TILE_BACKGROUNDS["neutral-dark"];
  }

  const fallbackStrength = day.intensity === "light" ? 0.78 : 0.42;
  const strength = clamp(day.strength ?? fallbackStrength, 0, 1);
  const fillAlpha = 0.18 + strength * 0.62;
  const glowAlpha = 0.08 + strength * 0.22;
  const base = day.tone === "win" ? [12, 233, 160] : [239, 68, 68];
  const accent = day.tone === "win" ? [16, 137, 97] : [152, 0, 0];

  return `linear-gradient(180deg, rgba(${base.join(", ")}, ${fillAlpha}) 0%, rgba(${accent.join(", ")}, ${fillAlpha}) 100%), radial-gradient(52.13% 193.91% at 47.87% 100%, rgba(${accent.join(", ")}, ${glowAlpha}) 0%, rgba(15, 23, 42, 0.06) 100%)`;
}

function CalendarDayTile({ day }: { day: TradingCalendarDay }) {
  return (
    <div
      className={cn(
        "flex h-[42px] items-center justify-center rounded-[4px] text-sm font-medium text-white",
        day.isOutsideMonth && "opacity-90",
      )}
      style={{ background: getTileBackground(day) }}
    >
      {day.day}
    </div>
  );
}

export function TradingCalendarCard({
  title = "Trading Calendar",
  sessionsLabel,
  weekdays = [...TRADING_CALENDAR_WEEKDAYS],
  days,
  className,
}: TradingCalendarCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[20px] border border-white/20 bg-white/5 p-4 md:p-6",
        className,
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-white md:text-lg">{title}</h3>
        <SessionsBadge label={sessionsLabel} />
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekdays.map((weekday) => (
          <div
            key={weekday}
            className=" text-center text-xs md:text-sm font-medium tracking-wide text-white/50 uppercase"
          >
            {weekday}
          </div>
        ))}

        {days.map((day) => (
          <CalendarDayTile key={day.id} day={day} />
        ))}
      </div>
    </article>
  );
}
