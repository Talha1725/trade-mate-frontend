"use client";

import * as React from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PortfolioMetricCards } from "@/components/portfolio/portfolio-metric-cards";
import { PortfolioAllocationCard } from "@/components/portfolio/portfolio-allocation-card";
import { PortfolioExposureBreakdownCard } from "@/components/portfolio/portfolio-exposure-breakdown-card";
import { PortfolioOpenPositionsTable } from "@/components/portfolio/portfolio-open-positions-table";
import { PortfolioTopMoversCard } from "@/components/portfolio/portfolio-top-movers-card";
import { PortfolioValueChart } from "@/components/portfolio/portfolio-value-chart";
import { terminalApi } from "@/lib/services/terminal.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { mapPortfolioPositionToPortfolioRow } from "@/lib/utils/trader-data";
import type { UserPortfolioResponse } from "@/types/dashboard";

export default function PortfolioPage() {
    const [snapshot, setSnapshot] = React.useState<UserPortfolioResponse | null>(null);
    const token = useAuthStore((state) => state.session?.token ?? null);

    const refreshSnapshot = React.useCallback(async () => {
        if (!token) return;
        const nextSnapshot = await terminalApi.getOpenPositions(token);
        setSnapshot(nextSnapshot);
    }, [token]);

    React.useEffect(() => {
        void refreshSnapshot();
    }, [refreshSnapshot]);

    React.useEffect(() => {
        window.addEventListener("trade-mate:positions-changed", refreshSnapshot);
        return () => window.removeEventListener("trade-mate:positions-changed", refreshSnapshot);
    }, [refreshSnapshot]);

    const positions = React.useMemo(
        () => snapshot?.positions.map(mapPortfolioPositionToPortfolioRow) ?? [],
        [snapshot?.positions],
    );

    const handleClosePosition = React.useCallback(
        async (positionId: string) => {
            if (!token) return;

            try {
                await terminalApi.closeTrade({ positionId }, token);
                toast.success("Position closed.");
                window.dispatchEvent(new Event("trade-mate:positions-changed"));
                await refreshSnapshot();
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to close position.");
            }
        },
        [refreshSnapshot, token],
    );

    const handleCloseAll = React.useCallback(async () => {
        if (!token || positions.length === 0) return;

        try {
            await Promise.all(positions.map((position) => terminalApi.closeTrade({ positionId: position.id }, token)));
            toast.success("All open positions closed.");
            window.dispatchEvent(new Event("trade-mate:positions-changed"));
            await refreshSnapshot();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to close all positions.");
        }
    }, [positions, refreshSnapshot, token]);

    const handleExport = React.useCallback(() => {
        if (positions.length === 0) return;

        const rows = positions.map((position) =>
            [position.symbol, position.side, position.size, position.avgEntry, position.markPrice, position.pnl].join(","),
        );
        const csv = [["Symbol", "Side", "Size", "Entry", "Mark", "PnL"].join(","), ...rows].join("\n");
        const blob = new Blob([csv], {
            type: "text/csv",
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "portfolio-open-positions.csv";
        anchor.click();
        URL.revokeObjectURL(url);
    }, [positions]);

    return (
        <AppShell>
            <div className="flex w-full min-w-0 flex-col gap-6">
                <PageHeader
                    title="Portfolio"
                    description="Portfolio overview, equity curve, and trading performance."
                />
                <PortfolioMetricCards />

                {/* 2 grid card  */}
                <div className="grid grid-cols-1 items-stretch gap-5 md:gap-6 xl:grid-cols-10">
                    <div className="flex xl:min-h-0 xl:col-span-6">
                        <PortfolioValueChart className="w-full h-[400px] xl:h-auto" />
                    </div>
                    <div className="flex xl:min-h-0 xl:col-span-4">
                        <PortfolioAllocationCard className="w-full " />
                    </div>
                </div>
                {/* 2 grid card  */}
                <div className="grid grid-cols-1 gap-5 md:gap-6  xl:grid-cols-2">
                    <PortfolioExposureBreakdownCard />
                    <PortfolioTopMoversCard />
                </div>

                {/* Open Positions Table */}
                <PortfolioOpenPositionsTable
                    positions={positions}
                    onCancel={handleClosePosition}
                    onCloseAll={handleCloseAll}
                    onExport={handleExport}
                />
            </div>
        </AppShell>
    );
}
