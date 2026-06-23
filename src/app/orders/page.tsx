import { AppShell } from "@/components/app-shell";
import { ActiveOrdersTable } from "@/components/orders/active-orders-table";
import { DepthChartCard } from "@/components/orders/depth-chart-card";
import { OrderBookCard } from "@/components/orders/order-book-card";
import { OrdersMetricCards } from "@/components/orders/orders-metric-cards";
import { RecentTradesTable } from "@/components/orders/recent-trades-table";
import { PageHeader } from "@/components/page-header";

export default function OrdersPage() {
  return (
    <AppShell>
      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title="Orders"
          description="View and manage your open orders."
        />
        {/* grid card  */}
        <OrdersMetricCards />
         {/* 2 grid equal  */}
        <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-2">
          <RecentTradesTable />
          <DepthChartCard />
        </div>
        <OrderBookCard />

        <ActiveOrdersTable />
      </div>
    </AppShell>
  );
}
