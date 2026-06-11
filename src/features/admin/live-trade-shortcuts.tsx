import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { ZapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockLiveTradeShortcuts } from "@/lib/mock-data/injection";

export function LiveTradeShortcuts() {
  return (
    <SectionCard title="Quick Push Shortcuts">
      <p className="text-sm text-muted-foreground mb-4">
        Instantly push common trades to all active accounts. Useful for testing or mass-broadcasting simulated news events.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {mockLiveTradeShortcuts.map((shortcut) => {
          const isBuy = shortcut.tone === "buy";

          return (
            <Button
              key={shortcut.label}
              variant="outline"
              className={cn(
                "justify-start gap-2",
                isBuy
                  ? "border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  : "border-rose-200 hover:bg-rose-50 hover:text-rose-700"
              )}
            >
              <ZapIcon className={cn("h-4 w-4", isBuy ? "text-emerald-500" : "text-rose-500")} />
              {shortcut.label}
            </Button>
          );
        })}
      </div>
    </SectionCard>
  );
}
