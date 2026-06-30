"use client";

import {
  mockTradingCalendarDays,
  TRADING_CALENDAR_TILE_BACKGROUNDS,
  TRADING_CALENDAR_WEEKDAYS,
} from "@/lib/mock-data/trading-calendar";
import { cn } from "@/lib/utils";
import type {
  TradingCalendarCardProps,
  TradingCalendarDay,
  TradingCalendarTileTone,
} from "@/types/trading-calendar-card";

function SessionsBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/20 bg-linear-to-b from-white/15 to-white/10 px-3 py-2 text-sm font-medium text-white">
      {label}
    </span>
  );
}

function getTileBackground(day: TradingCalendarDay) {
  const tone: TradingCalendarTileTone = `${day.tone}-${day.intensity}`;
  return TRADING_CALENDAR_TILE_BACKGROUNDS[tone];
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
  sessionsLabel = "22 Sessions",
  weekdays = [...TRADING_CALENDAR_WEEKDAYS],
  days = mockTradingCalendarDays,
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
