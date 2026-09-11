"use client";

import { useId, useMemo, useState } from "react";
import { PiDownloadFill } from "react-icons/pi";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { TRADING_TIMEFRAMES } from "@/constants/trading-timeframes";
import {
  getPortfolioValueYAxisTicks,
  mockPortfolioValueChartData,
} from "@/lib/mock-data/portfolio-value-chart";
import { formatPortfolioValueTimestamp } from "@/lib/utils/portfolio-chart";
import { cn } from "@/lib/utils";
import type { PortfolioValueChartProps, PortfolioValueChartTimeframe } from "@/types/portfolio-value-chart";

const CHART_CONFIG = {
  value: {
    label: "Portfolio Value",
    color: "var(--chart-green)",
  },
} satisfies ChartConfig;

const DENSE_DOT_THRESHOLD = 160;

function TimeframeButton({
  interval,
  isActive,
  onSelect,
}: {
  interval: PortfolioValueChartTimeframe;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "min-w-10 shrink-0 cursor-pointer rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
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
  timeframes = TRADING_TIMEFRAMES,
  showExportButton = false,
  exportLabel = "Export Report",
  onExport,
  onTimeframeChange,
  emptyStateMessage = "No portfolio value data available.",
  className,
}: PortfolioValueChartProps) {
  const gradientId = useId().replace(/:/g, "");
  const [timeframe, setTimeframe] = useState<PortfolioValueChartTimeframe>(defaultTimeframe);

  const chartData = useMemo(() => dataByTimeframe[timeframe] ?? [], [dataByTimeframe, timeframe]);
  const yAxis = useMemo(
    () => getPortfolioValueYAxisTicks(chartData.map((point) => point.value)),
    [chartData],
  );

  return (
    <article
      className={cn(
        "flex h-full min-h-[360px] min-w-0 flex-col overflow-hidden rounded-[20px] border border-white/20 bg-white/5 p-4 sm:min-h-[400px] md:p-6",
        className,
      )}
    >
      <div className="mb-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="min-w-0 text-base font-semibold text-white md:text-lg">{title}</h3>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <div className="-mx-1 flex min-w-0 max-w-full items-center gap-0.5 overflow-x-auto px-1">
            {timeframes.map((interval) => (
              <TimeframeButton
                key={interval}
                interval={interval}
                isActive={interval === timeframe}
                onSelect={() => {
                  setTimeframe(interval);
                  onTimeframeChange?.(interval);
                }}
              />
            ))}
          </div>

          {showExportButton ? (
            <button
              type="button"
              onClick={onExport}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-[10px] border border-white/5 bg-white/5 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <PiDownloadFill className="size-4" />
              {exportLabel}
            </button>
          ) : null}
        </div>
      </div>

      <div className="relative min-h-[240px] flex-1 w-full overflow-hidden sm:min-h-[280px] lg:min-h-[320px]">
        <ChartContainer
          config={CHART_CONFIG}
          initialDimension={{ width: 720, height: 320 }}
          className="relative aspect-auto h-full w-full [&_.recharts-cartesian-grid-horizontal_line]:stroke-white/10 [&_.recharts-cartesian-grid-vertical_line]:stroke-white/10"
        >
          {chartData.length > 0 ? (
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 10, left: 0, bottom: 18 }}
            >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-green)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--chart-green)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical horizontal strokeOpacity={0.1} />

            <XAxis
              dataKey="timestamp"
              type="number"
              scale="time"
              domain={["dataMin", "dataMax"]}
              tickFormatter={(value) => formatPortfolioValueTimestamp(Number(value), timeframe)}
              height={36}
              interval="preserveStartEnd"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            />

            <YAxis
              domain={yAxis.domain}
              ticks={yAxis.ticks}
              width={64}
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--chart-green)"
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={{
                r: chartData.length > DENSE_DOT_THRESHOLD ? 2 : 4,
                fill: "var(--chart-green)",
                stroke: "var(--chart-green-dark)",
                strokeWidth: chartData.length > DENSE_DOT_THRESHOLD ? 1 : 2,
              }}
              activeDot={{
                r: 5,
                fill: "var(--chart-green)",
                stroke: "var(--chart-green-dark)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="px-4 text-center text-sm text-white/60">{emptyStateMessage}</p>
          </div>
        )}
      </ChartContainer>
      </div>
    </article>
  );
}
