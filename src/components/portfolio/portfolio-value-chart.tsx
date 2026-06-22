"use client";

import { useId, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { TRADING_TIMEFRAMES } from "@/lib/mock-data/trading-filter-bar";
import {
  getPortfolioValueYAxisTicks,
  mockPortfolioValueChartData,
} from "@/lib/mock-data/portfolio-value-chart";
import { cn } from "@/lib/utils";
import type { PortfolioValueChartProps } from "@/types/portfolio-value-chart";
import type { TradingTimeframe } from "@/types/trading-filter-bar";

const CHART_CONFIG = {
  value: {
    label: "Portfolio Value",
    color: "#0CE9A0",
  },
} satisfies ChartConfig;

function TimeframeButton({
  interval,
  isActive,
  onSelect,
}: {
  interval: TradingTimeframe;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "min-w-[40px] cursor-pointer rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
        isActive
          ? "border border-primary bg-linear-to-r from-dark-blue via-teal-blue to-dark-blue text-primary"
          : "text-white/60 hover:text-white/80",
      )}
    >
      {interval}
    </button>
  );
}

export function PortfolioValueChart({
  title = "Portfolio Value Over Time",
  dataByTimeframe = mockPortfolioValueChartData,
  defaultTimeframe = "1m",
  className,
}: PortfolioValueChartProps) {
  const gradientId = useId().replace(/:/g, "");
  const [timeframe, setTimeframe] = useState<TradingTimeframe>(defaultTimeframe);

  const chartData = dataByTimeframe[timeframe] ?? [];
  const yAxis = useMemo(
    () => getPortfolioValueYAxisTicks(chartData.map((point) => point.value)),
    [chartData],
  );

  return (
    <article
      className={cn(
        "rounded-[20px] border border-white/20 bg-white/5 p-4 md:p-6",
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-white md:text-lg">{title}</h3>

        <div className="flex items-center gap-0.5">
          {TRADING_TIMEFRAMES.map((interval) => (
            <TimeframeButton
              key={interval}
              interval={interval}
              isActive={interval === timeframe}
              onSelect={() => setTimeframe(interval)}
            />
          ))}
        </div>
      </div>

      <ChartContainer
        config={CHART_CONFIG}
        className="aspect-auto h-[300px] w-full [&_.recharts-cartesian-grid-horizontal_line]:stroke-white/10 [&_.recharts-cartesian-grid-vertical_line]:stroke-white/10"
        initialDimension={{ width: 740, height: 230 }}
      >
        {chartData.length > 0 ? (
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0CE9A0" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0CE9A0" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical horizontal strokeOpacity={0.1} />

            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={0}
              interval={0}
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            />

            <YAxis
              domain={yAxis.domain}
              ticks={yAxis.ticks}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12, }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#0CE9A0"
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={{
                r: 3,
                fill: "#0CE9A0",
                stroke: "#0CE9A0",
                strokeWidth: 0,
              }}
              activeDot={{
                r: 4,
                fill: "#0CE9A0",
                stroke: "#108961",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/60">
            No portfolio value data available.
          </div>
        )}
      </ChartContainer>
    </article>
  );
}
