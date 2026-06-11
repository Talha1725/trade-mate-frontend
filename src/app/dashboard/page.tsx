import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PRIMARY_NAV_ITEMS } from "../../constant/nav-config";
import { EquityChart } from "@/components/dashboard/equity-chart";
import { BreakdownWidgets } from "@/components/dashboard/breakdown-widgets";
import { StatCards } from "@/components/dashboard/stat-cards";
import { OpenPositionsSummary } from "@/components/dashboard/open-positions-summary";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function DashboardPage() {
  return (
    <AppShell navItems={PRIMARY_NAV_ITEMS} userLabel="trader@trademate.app">
      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title="Dashboard"
          description="Account overview, equity curve, and trading performance."
        />

        <StatCards />

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <EquityChart />
          </div>
          <div className="md:col-span-1">
            <BreakdownWidgets />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <OpenPositionsSummary />
          <RecentActivity />
        </div>
      </div>
    </AppShell>
  );
}
