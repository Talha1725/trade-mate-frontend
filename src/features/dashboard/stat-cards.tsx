import { SectionCard } from "@/components/section-card";
import { mockStatCards } from "@/lib/mock-data/dashboard";
import { cn } from "@/lib/utils";

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {mockStatCards.map((stat) => (
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
