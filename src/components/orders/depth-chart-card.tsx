"use client";

import { useId, useMemo, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ReferenceDot, XAxis, YAxis } from "recharts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import {
  DEPTH_CHART_AXIS_TICKS,
  DEPTH_CHART_CENTER_PRICE,
  DEPTH_CHART_LEVELS,
  DEPTH_CHART_PRICE_MAX,
  DEPTH_CHART_PRICE_MIN,
  formatDepthPriceTick,
  mockDepthChartData,
} from "@/lib/mock-data/orders-depth-chart";
import { cn } from "@/lib/utils";
import type { DepthChartCardProps, DepthChartLevel } from "@/types/orders-depth-chart";

const BID_COLOR = "#00FFA3";
const ASK_COLOR = "#FF4D4D";
const GRID_COLOR = "rgba(255, 255, 255, 0.14)";

const CHART_CONFIG = {
  bids: {
    label: "Bids",
    color: BID_COLOR,
  },
  asks: {
    label: "Asks",
    color: ASK_COLOR,
  },
} satisfies ChartConfig;

const Y_AXIS_TICKS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function DepthLegendItem({
  label,
  tone,
}: {
  label: string;
  tone: "bid" | "ask";
}) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-white/60">
      <span
        className={cn(
          "size-3 rounded-full",
          tone === "bid"
            ? "bg-primary shadow-[0_0_10px_rgba(0,255,163,0.9)]"
            : "bg-destructive shadow-[0_0_10px_rgba(255,77,77,0.9)]",
        )}
      />
      {label}
    </span>
  );
}

export function DepthChartCard({
  title = "Depth Chart",
  dataByLevel = mockDepthChartData,
  defaultLevel = "100",
  priceMin = DEPTH_CHART_PRICE_MIN,
  priceMax = DEPTH_CHART_PRICE_MAX,
  centerPrice = DEPTH_CHART_CENTER_PRICE,
  axisTicks = DEPTH_CHART_AXIS_TICKS,
  isLoading = false,
  className,
}: DepthChartCardProps) {
  const bidGradientId = useId().replace(/:/g, "");
  const askGradientId = useId().replace(/:/g, "");
  const [depthLevel, setDepthLevel] = useState<DepthChartLevel>(defaultLevel);
  const chartData = useMemo(() => dataByLevel[depthLevel] ?? [], [dataByLevel, depthLevel]);
  const bidPoint = useMemo(() => {
    let latestBidPoint = null as (typeof chartData)[number] | null;

    for (const point of chartData) {
      if (point.bids != null) {
        latestBidPoint = point;
      }
    }

    return latestBidPoint;
  }, [chartData]);
  const askPoint = useMemo(() => chartData.find((point) => point.asks != null) ?? null, [chartData]);

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[20px] border border-white/20 bg-white/5 p-4 md:p-6",
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-white md:text-lg">{title}</h3>
          <div className="flex items-center gap-5">
            <DepthLegendItem label="Bids" tone="bid" />
            <DepthLegendItem label="Asks" tone="ask" />
          </div>
        </div>

        <Select
          value={depthLevel}
          onValueChange={(value) => setDepthLevel(value as DepthChartLevel)}
        >
          <SelectTrigger className="h-auto min-w-[76px] cursor-pointer rounded-lg border-white/20 bg-[#0C0C0C] px-3 py-2 text-sm text-white shadow-none hover:bg-white/10 focus-visible:border-primary focus-visible:ring-primary/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-[88px] border border-white/20 bg-[#0C0C0C] text-white">
            {DEPTH_CHART_LEVELS.map((level) => (
              <SelectItem
                key={level}
                value={level}
                className="rounded-lg cursor-pointer text-white focus:bg-white/10 focus:text-white data-highlighted:bg-white/10 hover:text-white data-highlighted:text-white data-selected:border data-selected:border-primary data-selected:bg-primary/10"
              >
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        <ChartContainer
          config={CHART_CONFIG}
          className="aspect-auto h-[330px] w-full"
          initialDimension={{ width: 520, height: 330 }}
        >
          <AreaChart data={chartData} margin={{ top: 12, right: 12, left: 4, bottom: 4 }}>
            <defs>
              <linearGradient id={bidGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BID_COLOR} stopOpacity={0.55} />
                <stop offset="55%" stopColor={BID_COLOR} stopOpacity={0.18} />
                <stop offset="100%" stopColor={BID_COLOR} stopOpacity={0} />
              </linearGradient>
              <linearGradient id={askGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ASK_COLOR} stopOpacity={0.55} />
                <stop offset="55%" stopColor={ASK_COLOR} stopOpacity={0.18} />
                <stop offset="100%" stopColor={ASK_COLOR} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical
              horizontal
              stroke={GRID_COLOR}
              strokeWidth={1}
              strokeOpacity={0.2}
            />

            <XAxis
              dataKey="price"
              type="number"
              domain={[priceMin, priceMax]}
              ticks={axisTicks}
              tickFormatter={formatDepthPriceTick}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12 }}
            />

            <YAxis
              domain={[0, 100]}
              ticks={Y_AXIS_TICKS}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={28}
              tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12 }}
            />

            <Area
              type="step"
              dataKey="bids"
              stroke={BID_COLOR}
              strokeWidth={1.5}
              fill={`url(#${bidGradientId})`}
              connectNulls={false}
              isAnimationActive={false}
              dot={false}
              activeDot={false}
            />

            <Area
              type="step"
              dataKey="asks"
              stroke={ASK_COLOR}
              strokeWidth={1.5}
              fill={`url(#${askGradientId})`}
              connectNulls={false}
              isAnimationActive={false}
              dot={false}
              activeDot={false}
            />

            {bidPoint != null || askPoint != null ? (
              <>
                {bidPoint != null ? (
                  <ReferenceDot
                    x={bidPoint.price}
                    y={bidPoint.bids ?? 0}
                    r={4}
                    fill={BID_COLOR}
                    stroke="none"
                  />
                ) : null}
                {askPoint != null ? (
                  <ReferenceDot
                    x={askPoint.price}
                    y={Math.max(askPoint.asks ?? 0, 3)}
                    r={5}
                    fill={ASK_COLOR}
                    stroke="#0C0C0C"
                    strokeWidth={2}
                  />
                ) : null}
              </>
            ) : null}
          </AreaChart>
        </ChartContainer>

        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl bg-black/30 backdrop-blur-[2px] text-white/60">
            <Loader2Icon className="size-5 animate-spin text-primary" />
            <span className="text-sm font-medium">Loading depth chart</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
