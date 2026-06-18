"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  History,
  Bell,
  Settings,
  Eye,
  EyeOff,
  Trophy,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { HiMiniChartBar } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarItemProps {
  icon?: React.ComponentType<{ className?: string }>;
  iconSrc?: string;
  label: string;
  href: string;
  active?: boolean;
  badge?: string | number;
}

export function SidebarItem({ icon: Icon, iconSrc, label, href, active, badge }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-5 py-3 transition-all duration-200 text-sm border rounded-[8px] font-medium group select-none cursor-pointer",
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

interface CardRowProps {
  icon?: LucideIcon;
  iconSrc?: string;
  label: string;
  subLabel: string;
  value: string;
  iconColorClass?: string;
  iconBgClass?: string;
  valueIcon?: React.ReactNode;
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
          <span className="text-[12px] font-medium text-white-500 leading-3">{label}</span>
          <span className="text-[8px] text-neutral-500 font-medium mt-1 leading-2">{subLabel}</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {valueIcon}
        <span className="text-[11px] font-bold text-neutral-200">{value}</span>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [showBalance, setShowBalance] = React.useState(true);

  // Map routes to determine active state
  const isTabActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="sticky top-0 h-screen w-[278px] justify-between shrink-0 p-4 rounded-[24px] border border-neutral-800/80 flex flex-col"
    >
    <div className="flex-1 overflow-y-auto no-scrollbar">
      {/* Brand Header */}
      <div className="flex items-center gap-3 select-none">
        <Image src="/images/logo.svg" alt="logo" height={40} width={213} />
      </div>

      {/* Workspace Label */} 
      <div> 
       <h3 className="text-base leading-4 pb-4 font-medium text-neutral-500 mt-7">
          Workspace
        </h3>
      </div>
      {/* Workspace Section */}
      <div className="flex flex-col gap-[10px] px-0">
        
        <SidebarItem
          icon={HiMiniChartBar}
          label="Chart View"
          href="/terminal"
          active={isTabActive("/terminal")}
        />
        <SidebarItem
          iconSrc="/sidebar icons/round graph.svg"
          label="Portfolio"
          href="/dashboard"
          active={isTabActive("/dashboard")}
        />
        <SidebarItem
          iconSrc="/sidebar icons/reorder.svg"
          label="Orders"
          href="/terminal"
          badge="2"
        />
        <SidebarItem
          icon={History}
          label="History"
          href="/history"
          active={isTabActive("/history")}
        />
        <SidebarItem
          iconSrc="/sidebar icons/pie chart 2.svg"
          label="Analytics"
          href="/dashboard?tab=analytics"
        />
      </div>

      {/* Tools Section */}
      <div className="flex flex-col gap-[10px] pb-10 px-0">
        <span className="text-base leading-4 font-medium text-neutral-500 py-2 mt-4">
          Tools
        </span>
        <SidebarItem
          icon={Bell}
          label="Alerts"
          href="/alerts"
          badge="3"
          active={isTabActive("/alerts")}
        />
        <SidebarItem
          icon={Settings}
          label="Settings"
          href="/dashboard?tab=settings"
        />
      </div>
    </div>

      {/* Account Widget Card */}
      <div className="p-4 rounded-[20px] card-green from-neutral-900/80 to-[#0C0C0E]/90 border border-white/20 flex flex-col gap-3.5 relative overflow-hidden">
        {/* Decorative Green Glow Spot */}
        <div className="absolute -bottom-12 -left-12 size-24 bg-[#22E0A2]/10 blur-[30px] rounded-full pointer-events-none" />

        {/* Card Header & Balance */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[14px] font-regular leading-3.5 text-neutral-400">
            Free Account
          </span>
          <div className="flex items-center justify-between">
            <span className="text-[24px] font-medium leading-6 text-white-500">
              {showBalance ? "$50,842.12" : "•••••••"}
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-neutral-500 hover:text-white transition-colors p-1 cursor-pointer rounded"
              title={showBalance ? "Hide Balance" : "Show Balance"}
            >
              {showBalance ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            </button>
          </div>
        </div>

        {/* Daily P&L */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[12px] leading-3 text-neutral-500 font-medium">Daily P&L</span>
            <span className="text-[#22E0A2] font-bold">+$2,315 (4.78%)</span>
          </div>
          <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#22E0A2] to-[#0CE9A0] rounded-full shadow-[0_0_8px_rgba(34,224,162,0.4)]"
              style={{ width: "70%" }}
            />
          </div>
        </div>

        {/* Reusable Card Rows */}
        <div className="flex flex-col gap-2">
          <CardRow
            iconSrc="/sidebar icons/open p&l.svg"
            label="Open P&L"
            subLabel="Today"
            value="$29,995.88"
          />
          <CardRow
            iconSrc="/sidebar icons/winrate.svg"
            label="Win Rate"
            subLabel="Last 30 Days"
            value="68.4%"
          />
          <CardRow
            iconSrc="/sidebar icons/cup star.svg"
            label="Best Asset"
            subLabel="Last 30 Days"
            value="BTCUSD"
            valueIcon={
              <Image src="/sidebar icons/bitcoin logo.svg" alt="Bitcoin" width={14} height={14} className="size-3.5" />
            }
          />
        </div>

        {/* Action Button */}
        <Link
          href="/dashboard?tab=analytics"
          className="w-full mt-1 py-2 px-3 rounded-sm bg-white/5 border border-white/20  flex items-center justify-center gap-1.5 cursor-pointer group"
        >
          <span className="text-[12px] leading-3 font-medium text-[#22E0A2] ">
            View Full Analytics
          </span>
          <ChevronRight className="size-3.5 text-[#22E0A2]" />
        </Link>
      </div>
    </aside>
  );
}
