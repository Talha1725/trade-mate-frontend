"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SectionCard } from "@/components/section-card";

const data = [
  { name: "Mon", equity: 10000 },
  { name: "Tue", equity: 10200 },
  { name: "Wed", equity: 10150 },
  { name: "Thu", equity: 10500 },
  { name: "Fri", equity: 10400 },
  { name: "Sat", equity: 11000 },
  { name: "Sun", equity: 12450 },
];

export function EquityChart() {
  return (
    <SectionCard title="Equity Curve">
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="equity"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
