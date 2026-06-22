import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PortfolioMetricCards } from "@/components/portfolio/portfolio-metric-cards";
import { PortfolioAllocationCard } from "@/components/portfolio/portfolio-allocation-card";
import { PortfolioExposureBreakdownCard } from "@/components/portfolio/portfolio-exposure-breakdown-card";
import { PortfolioOpenPositionsTable } from "@/components/portfolio/portfolio-open-positions-table";
import { PortfolioTopMoversCard } from "@/components/portfolio/portfolio-top-movers-card";
import { PortfolioValueChart } from "@/components/portfolio/portfolio-value-chart";

export default function PortfolioPage() {
    return (
        <AppShell>
            <div className="flex w-full flex-col gap-6">
                <PageHeader
                    title="Portfolio"
                    description="Portfolio overview, equity curve, and trading performance."
                />
                <PortfolioMetricCards />

                {/* 2 grid card  */}
                <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-10">
                    <div className="lg:col-span-6">
                        <PortfolioValueChart />
                    </div>
                    <div className="lg:col-span-4">
                        <PortfolioAllocationCard />
                    </div>
                </div>
                {/* 2 grid card  */}
                <div className="grid grid-cols-1 gap-5 md:gap-6  lg:grid-cols-2">
                    <PortfolioExposureBreakdownCard />
                    <PortfolioTopMoversCard />
                </div>

                {/* Open Positions Table */}
                <PortfolioOpenPositionsTable />
            </div>
        </AppShell>
    );
}
