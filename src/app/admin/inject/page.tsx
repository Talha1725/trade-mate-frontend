import { InjectTradeForm } from "@/components/admin/inject-trade-form";
import { PreviewPanel } from "@/components/admin/preview-panel";
import { PageHeader } from "@/components/page-header";

export default function AdminInjectPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        title="Inject Trades"
        description="Use natural language to intelligently inject trades into user accounts."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <InjectTradeForm />
        </div>
        <div className="flex flex-col gap-6">
          <PreviewPanel />
        </div>
      </div>
    </div>
  );
}
