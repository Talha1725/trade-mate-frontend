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
import { portfolioApi } from "@/lib/services/portfolio.api";
import { terminalApi } from "@/lib/services/terminal.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useSelectedAccountStore } from "@/lib/stores/account-store";
import {
    buildPortfolioAllocationItems,
    buildPortfolioExposureItems,
    buildPortfolioMetricCards,
} from "@/lib/utils/portfolio";
import { mapPortfolioPositionToPortfolioRow } from "@/lib/utils/trader-data";
import { mergeStablePositions } from "@/lib/utils/stable-positions";
import type { UserPortfolioResponse } from "@/types/dashboard";
import type { PortfolioOverviewResponse } from "@/types/portfolio-overview";
import { usePriceStream } from "@/hooks/use-price-stream";
import type { PriceSocketPortfolioMessage } from "@/types";

export default function PortfolioPage() {
    const [snapshot, setSnapshot] = React.useState<UserPortfolioResponse | null>(null);
    const [overview, setOverview] = React.useState<PortfolioOverviewResponse | null>(null);
    const token = useAuthStore((state) => state.session?.token ?? null);
    const selectedAccountId = useSelectedAccountStore((state) => state.selectedAccountId);
    const positionOrderRef = React.useRef(new Map<string, number>());
    const positionOrderCounterRef = React.useRef(0);
    const positionMissingCountsRef = React.useRef(new Map<string, number>());

    const normalizeOpenPositions = React.useCallback(
        (positions: UserPortfolioResponse["positions"]) => {
            const seen = new Set<string>();

            return positions.filter((position) => {
                if (position.status !== "OPEN" || seen.has(position.id)) {
                    return false;
                }

                if (selectedAccountId && position.accountId !== selectedAccountId) {
                    return false;
                }

                seen.add(position.id);
                return true;
            });
        },
        [selectedAccountId],
    );
    const refreshOverview = React.useCallback(async () => {
        if (!token) return;

        try {
            const nextOverview = await portfolioApi.getOverview(selectedAccountId ?? undefined);
            setOverview(nextOverview);
        } catch {
            setOverview(null);
        }
    }, [selectedAccountId, token]);

    const refreshSnapshot = React.useCallback(async () => {
        if (!token) return;

        try {
            const nextSnapshot = await terminalApi.getOpenPositions(token, selectedAccountId ?? undefined);
            setSnapshot({
                ...nextSnapshot,
                positions: normalizeOpenPositions(nextSnapshot.positions),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : "Unable to load portfolio snapshot.";
            toast.error(message);
            console.error("Unable to load portfolio snapshot.", error);
        }
    }, [normalizeOpenPositions, selectedAccountId, token]);

    React.useEffect(() => {
        void refreshSnapshot();
    }, [refreshSnapshot]);

    React.useEffect(() => {
        void refreshOverview();
    }, [refreshOverview]);

    React.useEffect(() => {
        window.addEventListener("trade-mate:positions-changed", refreshSnapshot);
        window.addEventListener("trade-mate:positions-changed", refreshOverview);
        return () => {
            window.removeEventListener("trade-mate:positions-changed", refreshSnapshot);
            window.removeEventListener("trade-mate:positions-changed", refreshOverview);
        };
    }, [refreshOverview, refreshSnapshot]);

    const positions = React.useMemo(() => {
        const nextPositions = snapshot?.positions.map((position) => mapPortfolioPositionToPortfolioRow(position)) ?? [];

        for (const position of nextPositions) {
            if (!positionOrderRef.current.has(position.id)) {
                positionOrderRef.current.set(position.id, positionOrderCounterRef.current += 1);
            }
        }

        return [...nextPositions].sort((left, right) => {
            const leftOrder = positionOrderRef.current.get(left.id) ?? Number.MAX_SAFE_INTEGER;
            const rightOrder = positionOrderRef.current.get(right.id) ?? Number.MAX_SAFE_INTEGER;
            return leftOrder - rightOrder;
        });
    }, [snapshot?.positions]);

    const metricCards = React.useMemo(() => {
        if (!snapshot?.account || !overview) {
            return [];
        }

        return buildPortfolioMetricCards(snapshot.account, overview);
    }, [overview, snapshot?.account]);

    const allocationItems = React.useMemo(() => {
        if (!snapshot?.account) {
            return overview?.allocation.items ?? [];
        }

        return buildPortfolioAllocationItems(snapshot.account, snapshot.positions);
    }, [overview?.allocation.items, snapshot?.account, snapshot?.positions]);

    const exposureItems = React.useMemo(() => {
        if (!snapshot?.positions) {
            return [];
        }

        return buildPortfolioExposureItems(snapshot.positions);
    }, [snapshot?.positions]);

    const accountId = snapshot?.account.id ?? selectedAccountId ?? null;

    const resolvePortfolioAccount = React.useCallback(
        (payload: PriceSocketPortfolioMessage) => {
            if (accountId) {
                const matchedAccount = payload.accounts.find((item) => item.id === accountId);

                if (matchedAccount) {
                    return matchedAccount;
                }

                return null;
            }

            return payload.accounts[0] ?? null;
        },
        [accountId],
    );

    usePriceStream({
        enabled: !!token && !!accountId,
        accountIds: accountId ? [accountId] : [],
        onPortfolio: (payload: PriceSocketPortfolioMessage) => {
            const account = resolvePortfolioAccount(payload);

            if (!account) {
                return;
            }

            const closedIds = new Set(
                payload.trades
                    .filter((trade) => trade.status === "CLOSED" && trade.positionId)
                    .map((trade) => trade.positionId as string),
            );

            setSnapshot((current) => {
                if (!current) {
                    return {
                        account,
                        positions: normalizeOpenPositions(payload.positions),
                    };
                }

                return {
                    ...current,
                    account,
                    positions: normalizeOpenPositions(
                        mergeStablePositions(
                            current.positions,
                            payload.positions,
                            positionMissingCountsRef.current,
                            { closedIds },
                        ),
                    ),
                };
            });
        },
    });

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
                <PortfolioMetricCards cards={metricCards} />

                {/* 2 grid card  */}
                <div className="grid grid-cols-1 items-stretch gap-5 md:gap-6 xl:grid-cols-10">
                    <div className="flex xl:min-h-0 xl:col-span-6">
                        <PortfolioValueChart
                            className="w-full h-[400px] xl:h-auto"
                            dataByTimeframe={overview?.chart.dataByTimeframe ?? {}}
                            defaultTimeframe={overview?.chart.defaultTimeframe ?? "4H"}
                        />
                    </div>
                    <div className="flex xl:min-h-0 xl:col-span-4">
                        <PortfolioAllocationCard
                            className="w-full "
                            items={allocationItems}
                        />
                    </div>
                </div>
                {/* 2 grid card  */}
                <div className="grid grid-cols-1 gap-5 md:gap-6  xl:grid-cols-2">
                    <PortfolioExposureBreakdownCard
                        badgeLabel={overview?.exposure.badgeLabel}
                        items={exposureItems}
                    />
                    <PortfolioTopMoversCard items={overview?.topMovers.items ?? []} />
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
