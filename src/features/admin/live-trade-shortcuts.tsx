import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { ZapIcon } from "lucide-react";

export function LiveTradeShortcuts() {
  return (
    <SectionCard title="Quick Push Shortcuts">
      <p className="text-sm text-muted-foreground mb-4">
        Instantly push common trades to all active accounts. Useful for testing or mass-broadcasting simulated news events.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <Button variant="outline" className="justify-start gap-2 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
          <ZapIcon className="h-4 w-4 text-emerald-500" />
          Buy 1.0 EURUSD
        </Button>
        <Button variant="outline" className="justify-start gap-2 border-rose-200 hover:bg-rose-50 hover:text-rose-700">
          <ZapIcon className="h-4 w-4 text-rose-500" />
          Sell 1.0 EURUSD
        </Button>
        <Button variant="outline" className="justify-start gap-2 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700">
          <ZapIcon className="h-4 w-4 text-emerald-500" />
          Buy 0.1 XAUUSD
        </Button>
        <Button variant="outline" className="justify-start gap-2 border-rose-200 hover:bg-rose-50 hover:text-rose-700">
          <ZapIcon className="h-4 w-4 text-rose-500" />
          Close All Profits
        </Button>
      </div>
    </SectionCard>
  );
}
