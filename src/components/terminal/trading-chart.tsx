import { ActivityIcon } from "lucide-react";
import { SectionCard } from "@/components/section-card";

export function TradingChart() {
  return (
    <SectionCard 
      title="Chart - EURUSD" 
      className="h-full flex flex-col min-h-[400px]"
      contentClassName="flex-1 flex flex-col"
    >
      <div className="flex flex-1 w-full min-h-[300px] flex-col items-center justify-center gap-2 rounded-md border border-dashed text-muted-foreground bg-muted/20">
        <ActivityIcon className="h-8 w-8 opacity-50" />
        <span className="text-sm font-medium">TradingView Chart Placeholder</span>
      </div>
    </SectionCard>
  );
}
