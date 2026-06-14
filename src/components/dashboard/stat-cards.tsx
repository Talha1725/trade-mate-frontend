import { SectionCard } from "@/components/section-card";
import { mockStatCards } from "@/lib/mock-data/dashboard";
import { cn } from "@/lib/utils";
import type { StatCardsProps } from "@/types";

export function StatCards({ stats }: StatCardsProps) {
  const data = stats?.length ? stats : mockStatCards;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((stat) => (
        <SectionCard key={stat.title} title={stat.title}>
          <p className={cn("text-3xl font-semibold tracking-tight", stat.tone === "success" && "text-emerald-600")}>
            {stat.value}
          </p>
          <p className="text-sm text-muted-foreground">{stat.description}</p>
        </SectionCard>
      ))}
    </div>
  );
}
