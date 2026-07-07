"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  History,
  Settings,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react";
import { HiMiniChartBar } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AssetIcon } from "@/components/shared/asset-icon";
import type { SidebarItemProps, CardRowProps } from "@/types/components";
import { useAccountSummary, usePositions } from "@/hooks/use-trades";
import { SIDEBAR_ICONS } from "@/lib/mock-data/sidebar-icons";
import { useSelectedAccountStore } from "@/lib/stores/account-store";
import { usePriceStream } from "@/hooks/use-price-stream";
import { formatTradingSymbolLabel } from "@/lib/utils/market-symbol-icon";

function formatCurrency(value?: number) {
  return `$${(value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function SidebarItem({ icon: Icon, iconSrc, label, href, active, badge }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-5 py-[11.5px] transition-all duration-200 text-sm border rounded-[8px] font-medium group select-none cursor-pointer",
        active
          ? "card-green text-white border-primary"
          : "border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/20"
      )}
    >
      {iconSrc ? (
        <Image
          src={iconSrc}
          alt={label}
          width={20}
          height={20}
          className={cn(
            "size-5 shrink-0 transition-all",
            active ? "opacity-100" : "opacity-40 group-hover:opacity-100"
          )}
        />
      ) : Icon ? (
        <Icon
          className={cn(
            "size-5 shrink-0 transition-colors",
            active ? "text-white group-hover:text-white" : "text-neutral-400 group-hover:text-neutral-200"
          )}
        />
      ) : null}
      <span className="truncate">{label}</span>
      {badge !== undefined && (
        <span className="ml-auto bg-[#22E0A2] text-black text-[10px] font-black rounded-full size-5 flex items-center justify-center shadow-[0_0_8px_rgba(34,224,162,0.25)]">
          {badge}
        </span>
      )}
    </Link>
  );
}

function CardRow({
  icon: Icon,
  iconSrc,
  label,
  subLabel,
  value,
  iconColorClass,
  iconBgClass,
  valueIcon,
}: CardRowProps) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/20 ">
      <div className="flex items-center gap-2.5">
        <div className={`size-7 rounded-sm! flex items-center justify-center shrink-0 ${label === "Open P&L" ? "btn-green" : label === "Best Asset" ? "btn-orange" : label === "Win Rate" ? "btn-blue" : ""} ${iconBgClass}`}>
          {iconSrc ? (
            <Image src={iconSrc} alt={label} width={14} height={14} className="size-3.5" />
          ) : Icon ? (
            <Icon className={cn("size-3.5", iconColorClass)} />
          ) : null}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-medium text-white leading-3">{label}</span>
          <span className="text-[8px] text-white/60 font-medium mt-1 leading-2">{subLabel}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {valueIcon}
        <span className="text-xs font-semibold text-[#EDF6FF]">{value}</span>
      </div>
    </div>
  );
}

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [showBalance, setShowBalance] = React.useState(true);
  const selectedAccountId = useSelectedAccountStore((state) => state.selectedAccountId);
  const { data: accountSummary } = useAccountSummary(selectedAccountId);
  const bestAssetSymbol = accountSummary?.bestAsset?.symbol ?? null;

  const { data: openPositions } = usePositions(selectedAccountId);
  const [openOrdersCount, setOpenOrdersCount] = React.useState(0);

  React.useEffect(() => {
    setOpenOrdersCount(openPositions?.positions?.filter((position) => position.status === "OPEN").length ?? 0);
  }, [openPositions?.positions]);

  usePriceStream({
    enabled: !!selectedAccountId,
    symbols: [],
    accountIds: selectedAccountId ? [selectedAccountId] : [],
    onPortfolio: (payload) => {
      const nextCount = payload.positions.filter(
        (position) => position.accountId === selectedAccountId && position.status === "OPEN",
      ).length;

      setOpenOrdersCount(nextCount);
    },
  });

  // Map routes to determine active state
  const isTabActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex w-[278px] shrink-0 flex-col overflow-x-hidden rounded-[20px] border border-white/20 p-4",
        "h-full overflow-y-auto no-scrollbar",
        "lg:sticky lg:top-0 lg:min-h-dvh lg:max-h-dvh lg:self-start lg:overflow-hidden lg:no-scrollbar",
        className,
      )}
    >
    <div className="flex min-h-0 flex-1 flex-col py-1 overflow-y-auto no-scrollbar">
      {/* Brand Header */}
      <div className="flex items-center gap-3 select-none">
        <Image src="/images/logo.svg" alt="logo" height={40} width={213} loading="eager" />
      </div>

      {/* Workspace Label */} 
      <div> 
       <h3 className="text-base leading-4 pb-4 font-medium text-white/60 mt-8">
          Workspace
        </h3>
      </div>
      {/* Workspace Section */}
      <div className="flex flex-col overflow-visible gap-2.5 px-0">
        
        <SidebarItem
          icon={HiMiniChartBar}
          label="Chart View"
          href="/dashboard"
          active={isTabActive("/dashboard")}
        />
        <SidebarItem
          iconSrc={SIDEBAR_ICONS.roundGraph}
          label="Portfolio"
          href="/porfolio"
          active={isTabActive("/porfolio")}
        />
        <SidebarItem
          iconSrc={SIDEBAR_ICONS.reorder}
          label="Orders"
          href="/orders"
          badge={openOrdersCount}
          active={isTabActive("/orders")}
        />
        <SidebarItem
          icon={History}
          label="History"
          href="/history"
          active={isTabActive("/history")}
        />
        <SidebarItem
          iconSrc={SIDEBAR_ICONS.pieChart2}
          label="Analytics"
          href="/analytics"
          active={isTabActive("/analytics")}
        />
      </div>

      {/* Tools Section */}
      <div className="flex flex-col gap-[10px] px-0 pt-2.5">
        <SidebarItem
          icon={Settings}
          label="Settings"
          href="/settings"
          active={isTabActive("/settings")}
        />
      </div>
    </div>

      {/* Account Widget Card */}
      {/* Diamond Widget (Hidden)
      {pathname === "/porfolio" && (
        <div className="mt-4 shrink-0 p-4 rounded-[20px] card-green border border-white/20 flex flex-col w-full">
          <div className="absolute -bottom-12 -left-12 size-24 blur-[30px] rounded-full pointer-events-none" />

          <div className="flex justify-center">
            <Image src={SIDEBAR_ICONS.diamond} alt="diamond" width={214} height={88} loading="eager" />
          </div>

          <div className="flex flex-col items-center gap-2.5 py-5 text-center">
            <span className="text-[18px] font-medium text-white leading-4.5">
              Unlock Pro Insights
            </span>
            <span className="text-xs text-white/60">
              Get AI-powered analytics and advanced features.
            </span>
          </div>

          <Link
            href="/analytics"
            className="w-full py-[9px] px-2 rounded-sm hover:bg-white/8 duration-300 bg-white/4 border border-white/5 flex items-center  justify-center gap-1.5"
          >
            <span className="text-sm  font-medium text-primary">
              Upgrade to Pro
            </span>
            <Image src={SIDEBAR_ICONS.upload} alt="upload" width={14} height={14} className="size-3.5" />
          </Link>
        </div>
      )}
      */}
      <div className="mt-4 shrink-0 p-4 rounded-[20px] card-green from-neutral-900/80 to-[#0C0C0E]/90 border border-white/20 flex flex-col gap-3.5 relative overflow-hidden">
          {/* Decorative Green Glow Spot */}
          <div className="absolute -bottom-12 -left-12 size-24 bg-[#22E0A2]/10 blur-[30px] rounded-full pointer-events-none" />

          {/* Card Header & Balance */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[14px] font-regular leading-3.5 text-neutral-400">
              {accountSummary?.accountNumber || accountSummary?.fundingType || "Account Overview"}
            </span>
            <div className="flex items-center justify-between">
              <span className="text-[24px] font-medium leading-6 text-white">
                {showBalance ? formatCurrency(accountSummary?.balance) : "•••••••"}
              </span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-white/60 hover:text-white transition-colors p-1 cursor-pointer rounded"
                title={showBalance ? "Hide Balance" : "Show Balance"}
              >
                {showBalance ? <Eye className="size-4.5" /> : <EyeOff className="size-4.5" />}
              </button>
            </div>
          </div>

          {/* Daily P&L */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-xs leading-3 text-white/60 font-medium">Daily P&L</span>
              <span className={cn("font-semibold text-xs", (accountSummary?.floatingPnl ?? 0) >= 0 ? "text-primary" : "text-destructive")}>
                {formatCurrency(accountSummary?.floatingPnl)}
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-linear-to-r from-primary to-[#10B981] rounded-full shadow-[0_0_8px_rgba(34,224,162,0.4)]"
                style={{ width: "70%" }}
              />
            </div>
          </div>

          {/* Reusable Card Rows */}
          <div className="flex flex-col gap-2">
            <CardRow
              iconSrc={SIDEBAR_ICONS.openPnl}
              label="Open P&L"
              subLabel="Today"
              value={formatCurrency(accountSummary?.floatingPnl)}
            />
            <CardRow
              iconSrc={SIDEBAR_ICONS.winrate}
              label="Win Rate"
              subLabel="Last 30 Days"
              value={`${Math.round(accountSummary?.winRate ?? 0)}%`}
            />
            <CardRow
              iconSrc={SIDEBAR_ICONS.cupStar}
              label="Best Asset"
              subLabel="Last 30 Days"
              value={bestAssetSymbol ? formatTradingSymbolLabel(bestAssetSymbol) : "N/A"}
              valueIcon={
                bestAssetSymbol ? (
                  <AssetIcon symbol={bestAssetSymbol} label={bestAssetSymbol} size={14} className="size-3.5" />
                ) : null
              }
            />
          </div>

          {/* Action Button */}
          <Link
            href="/analytics"
            className="w-full mt-1 py-2.5 px-3 rounded-sm hover:bg-white/10 transition-all duration-200 bg-white/4 border border-white/5  flex items-center justify-center gap-1.5 cursor-pointer group"
          >
            <span className="text-xs leading-3 font-medium text-primary ">
              View Full Analytics
            </span>
            <ChevronRight className="size-3.5 text-primary" />
          </Link>
        </div>
    </aside>
  );
}
