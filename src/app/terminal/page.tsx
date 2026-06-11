import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PRIMARY_NAV_ITEMS } from "../../constant/nav-config";
import { SymbolSearch } from "@/components/terminal/symbol-search";
import { TradingChart } from "@/components/terminal/trading-chart";
import { OrderTicket } from "@/components/terminal/order-ticket";
import { OpenPositionsTable } from "@/components/terminal/open-positions-table";

export default function TerminalPage() {
  return (
    <AppShell navItems={PRIMARY_NAV_ITEMS} userLabel="trader@trademate.app">
      <div className="flex w-full flex-col gap-6">
        <PageHeader
          title="Terminal"
          description="Place trades, view charts, and manage positions."
        />

        <div className="flex flex-col gap-6 w-full">
          {/* Row 1: Symbol Box (Full width) */}
          <SymbolSearch />

          {/* Row 2: Chart and Order Ticket side by side */}
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="flex flex-col lg:col-span-8">
              <TradingChart />
            </div>
            
            <div className="flex flex-col lg:col-span-4">
              <OrderTicket />
            </div>
          </div>

          {/* Row 3: Open Positions */}
          <OpenPositionsTable />
        </div>
      </div>
    </AppShell>
  );
}
