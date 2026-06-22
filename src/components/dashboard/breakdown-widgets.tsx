"use client";

import { SectionCard } from "@/components/section-card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { BreakdownWidgetsProps } from "@/types";

export function BreakdownWidgets({ data }: BreakdownWidgetsProps) {
  const chartData = data ?? [];
  const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

  return (
    <SectionCard title="P/L by Symbol" className="h-full">
      <div className="h-[250px] w-full">
        {chartData.length > 0 ? (
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
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No symbol breakdown available yet.
          </div>
        )}
      </div>
    </SectionCard>
  );
}
