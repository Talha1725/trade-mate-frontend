import { AppShell } from "@/components/app-shell";
import { ChallengeProgressCard } from "@/components/analytics/challenge-progress-card";
import { PerformanceInsightsCard } from "@/components/analytics/performance-insights-card";
import { TradingCalendarCard } from "@/components/analytics/trading-calendar-card";
import { RecentTradesTable } from "@/components/orders/recent-trades-table";
import { PageHeader } from "@/components/page-header";
import { PortfolioMetricCards } from "@/components/portfolio/portfolio-metric-cards";
import { PortfolioValueChart } from "@/components/portfolio/portfolio-value-chart";
import { mockAnalyticsMetricCards } from "@/lib/mock-data/analytics-metrics";
import {
    EQUITY_CURVE_TIMEFRAMES,
    mockEquityCurveChartData,
} from "@/lib/mock-data/equity-curve-chart";
import { mockStrategyPerformanceRows } from "@/lib/mock-data/strategy-performance";

export default function AnalyticsPage() {
    return (
        <AppShell>
            <div className="flex w-full min-w-0 flex-col gap-6">
                <PageHeader
                    title="Analytics"
                    description="Review analytics and performance."
                />

                <PortfolioMetricCards
                    cards={mockAnalyticsMetricCards}
                    className="md:grid-cols-2 xl:grid-cols-3 min-[1700px]:grid-cols-6!"
                />
                {/* 2grid card  */}
                <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-10">
                    <div className="lg:col-span-4">
                        <ChallengeProgressCard />
                    </div>
                    <div className="lg:col-span-6">
                        <PortfolioValueChart
                            title="Equity Curve"
                            dataByTimeframe={mockEquityCurveChartData}
                            timeframes={EQUITY_CURVE_TIMEFRAMES}
                            defaultTimeframe="1m"
                            showExportButton
                            emptyStateMessage="No equity curve data available."
                            className="h-full"
                        />
                    </div>
                </div>
                {/* 3 grid card  */}
                <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-3">
                    <TradingCalendarCard />
                    <RecentTradesTable
                        variant="strategy-performance"
                        strategies={mockStrategyPerformanceRows}
                        className="h-full"
                    />
                    <PerformanceInsightsCard className="h-full" />
                </div>
            </div>
        </AppShell>
    );
}