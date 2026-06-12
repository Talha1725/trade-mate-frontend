"use client";

import { ActivityIcon } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SectionCard } from "@/components/section-card";
import { useHistory } from "@/hooks/use-market";

type TradingChartProps = {
  symbol: string;
};

export function TradingChart({ symbol }: TradingChartProps) {
  const { data: history, isLoading } = useHistory(symbol);

  const chartData = history?.map((point) => ({
    time: new Date(point.time).toLocaleTimeString(),
    price: point.close,
  }));

  return (
    <SectionCard
      title={`Chart — ${symbol}`}
      className="h-full flex flex-col min-h-[400px]"
      contentClassName="flex-1 flex flex-col"
    >
      {isLoading ? (
        <div className="flex flex-1 w-full min-h-[300px] flex-col items-center justify-center gap-2 rounded-md border border-dashed text-muted-foreground bg-muted/20">
          <ActivityIcon className="h-8 w-8 opacity-50" />
          <span className="text-sm font-medium">Loading chart data...</span>
        </div>
      ) : chartData && chartData.length > 0 ? (
        <div className="flex-1 w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis
                dataKey="time"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-1 w-full min-h-[300px] flex-col items-center justify-center gap-2 rounded-md border border-dashed text-muted-foreground bg-muted/20">
          <ActivityIcon className="h-8 w-8 opacity-50" />
          <span className="text-sm font-medium">No chart data available</span>
        </div>
      )}
    </SectionCard>
  );
}
