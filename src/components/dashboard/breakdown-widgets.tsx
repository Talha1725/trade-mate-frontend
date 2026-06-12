"use client";

import { SectionCard } from "@/components/section-card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { mockSymbolBreakdown, mockSymbolBreakdownColors } from "@/lib/mock-data/dashboard";
import type { BreakdownWidgetsProps } from "@/types";

export function BreakdownWidgets({ data }: BreakdownWidgetsProps) {
  const chartData = data?.length ? data : mockSymbolBreakdown;

  return (
    <SectionCard title="P/L by Symbol" className="h-full">
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={mockSymbolBreakdownColors[index % mockSymbolBreakdownColors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
