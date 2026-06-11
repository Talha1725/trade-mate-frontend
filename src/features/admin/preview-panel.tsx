import { SectionCard } from "@/components/section-card";
import { CheckCircleIcon, ArrowRightIcon } from "lucide-react";

export function PreviewPanel() {
  // Static mock for now
  return (
    <SectionCard title="AI Interpretation Preview">
      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-md bg-muted/50 border border-muted flex flex-col gap-3">
          <div className="flex items-center gap-2 text-emerald-600 font-medium">
            <CheckCircleIcon className="h-5 w-5" />
            <span>Successfully parsed instructions</span>
          </div>
          
          <div className="grid gap-2 text-sm mt-2">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground w-20">Target:</span>
              <span className="font-medium">All Active Accounts (2 accounts)</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-muted-foreground w-20">Actions:</span>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center gap-2 p-2 bg-white rounded border">
                  <span className="font-semibold text-rose-600">CLOSE</span>
                  <ArrowRightIcon className="h-3 w-3 text-muted-foreground" />
                  <span>All <span className="font-bold">EURUSD</span> Buy positions</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white rounded border">
                  <span className="font-semibold text-rose-600">SELL</span>
                  <ArrowRightIcon className="h-3 w-3 text-muted-foreground" />
                  <span><span className="font-bold">2.0</span> lots <span className="font-bold">GBPUSD</span> @ Market</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-2">
          Review the parsed actions before executing. This operation will be logged in the audit trail.
        </p>
      </div>
    </SectionCard>
  );
}
