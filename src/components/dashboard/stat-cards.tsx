"use client";

import { SectionCard } from "@/components/section-card";
import { cn } from "@/lib/utils";
import { useAccountSummary } from "@/hooks/use-trades";

export function StatCards() {
  const { data: summary, isLoading } = useAccountSummary();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <SectionCard key={i} title="Loading...">
            <p className="text-3xl font-semibold tracking-tight text-muted-foreground">
              —
            </p>
          </SectionCard>
        ))}
      </div>
    );
  }

  const cards = summary
    ? [
        {
          title: "Account Balance",
          value: `$${summary.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          description: "Current account balance",
        },
        {
          title: "Equity",
          value: `$${summary.equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
          description: "Balance + floating P&L",
        },
        {
          title: "Floating P&L",
          value: `${summary.floatingPnl >= 0 ? "+" : ""}$${summary.floatingPnl.toFixed(2)}`,
          description: "Unrealized profit / loss",
          tone: summary.floatingPnl >= 0 ? ("success" as const) : undefined,
        },
        {
          title: "Win Rate",
          value: `${summary.winRate.toFixed(0)}%`,
          description: "All-time win rate",
        },
      ]
    : [
        { title: "Account Balance", value: "$0.00", description: "-" },
        { title: "Equity", value: "$0.00", description: "-" },
        { title: "Floating P&L", value: "$0.00", description: "-" },
        { title: "Win Rate", value: "0%", description: "-" },
      ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat) => (
        <SectionCard key={stat.title} title={stat.title}>
          <p
            className={cn(
              "text-3xl font-semibold tracking-tight",
              stat.tone === "success" && "text-emerald-600",
            )}
          >
            {stat.value}
          </p>
          <p className="text-sm text-muted-foreground">{stat.description}</p>
        </SectionCard>
      ))}
    </div>
  );
}
