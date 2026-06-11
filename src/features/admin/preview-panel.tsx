import { SectionCard } from "@/components/section-card";
import { CheckCircleIcon, ArrowRightIcon } from "lucide-react";
import { mockInjectionPreview } from "@/lib/mock-data/injection";

export function PreviewPanel() {
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
              <span className="font-medium">{mockInjectionPreview.target}</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-muted-foreground w-20">Actions:</span>
              <div className="flex flex-col gap-2 flex-1">
                {mockInjectionPreview.actions.map((action) => (
                  <div key={`${action.action}-${action.details}`} className="flex items-center gap-2 p-2 bg-white rounded border">
                    <span className="font-semibold text-rose-600">{action.action}</span>
                    <ArrowRightIcon className="h-3 w-3 text-muted-foreground" />
                    <span>{action.details}</span>
                  </div>
                ))}
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
