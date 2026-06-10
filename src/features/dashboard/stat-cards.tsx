import { SectionCard } from "@/components/section-card";

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SectionCard title="Account Balance">
        <p className="text-3xl font-semibold tracking-tight">$12,450.80</p>
        <p className="text-sm text-muted-foreground">
          +2.3% from last month
        </p>
      </SectionCard>

      <SectionCard title="Open Positions">
        <p className="text-3xl font-semibold tracking-tight">4</p>
        <p className="text-sm text-muted-foreground">2 long / 2 short</p>
      </SectionCard>

      <SectionCard title="Today's P&L">
        <p className="text-3xl font-semibold tracking-tight text-emerald-600">
          +$184.20
        </p>
        <p className="text-sm text-muted-foreground">+1.5% today</p>
      </SectionCard>

      <SectionCard title="Win Rate">
        <p className="text-3xl font-semibold tracking-tight">68%</p>
        <p className="text-sm text-muted-foreground">Last 30 trades</p>
      </SectionCard>
    </div>
  );
}
