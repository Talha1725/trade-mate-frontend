"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  TrendingUp,
  Briefcase,
  ArrowUpDown,
  History,
  BarChart3,
  Bell,
  Settings,
  Eye,
  EyeOff,
  Wallet2,
  Target,
  Trophy,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
  badge?: string | number;
}

export function SidebarItem({ icon: Icon, label, href, active, badge }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium border group select-none cursor-pointer",
        active
          ? "bg-gradient-to-r from-[#22E0A2]/10 to-[#108961]/5 border-[#22E0A2]/80 text-white shadow-[0_0_15px_rgba(34,224,162,0.06)]"
          : "border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/20"
      )}
    >
      <Icon
        className={cn(
          "size-[18px] shrink-0 transition-colors",
          active ? "text-[#22E0A2]" : "text-neutral-500 group-hover:text-neutral-400"
        )}
      />
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
  icon: LucideIcon;
  label: string;
  subLabel: string;
  value: string;
  iconColorClass: string;
  iconBgClass: string;
  valueIcon?: React.ReactNode;
}

function CardRow({
  icon: Icon,
  label,
  subLabel,
  value,
  iconColorClass,
  iconBgClass,
  valueIcon,
}: CardRowProps) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#09090b]/60 border border-neutral-800/40 hover:border-neutral-800/80 transition-colors">
      <div className="flex items-center gap-2.5">
        <div className={cn("size-7 rounded-lg flex items-center justify-center shrink-0 border border-neutral-800/30", iconBgClass)}>
          <Icon className={cn("size-3.5", iconColorClass)} />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-white leading-none">{label}</span>
          <span className="text-[9px] text-neutral-500 mt-1 leading-none">{subLabel}</span>
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
      className="flex flex-col shrink-0 p-4 rounded-[24px] w-[286px] border border-neutral-800/80 select-none relative overflow-y-auto"
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 select-none">
        <Image src="/images/logo.svg" alt="logo" height={40} width={213} />
      </div>

      {/* Workspace Label */} 
      <div> 
       <h3 className="text-[10px] pb-4 uppercase font-bold text-neutral-500 px-2 mt-2">
          Workspace
        </h3>
      </div>
      {/* Workspace Section */}
      <div className="flex flex-col gap-[10px] px-0">
        
        <SidebarItem
          icon={TrendingUp}
          label="Chart View"
          href="/terminal"
          active={isTabActive("/terminal")}
        />
        <SidebarItem
          icon={Briefcase}
          label="Portfolio"
          href="/dashboard"
          active={isTabActive("/dashboard")}
        />
        <SidebarItem
          icon={ArrowUpDown}
          label="Orders"
          href="/terminal?tab=orders"
          badge="2"
        />
        <SidebarItem
          icon={History}
          label="History"
          href="/history"
          active={isTabActive("/history")}
        />
        <SidebarItem
          icon={BarChart3}
          label="Analytics"
          href="/dashboard?tab=analytics"
        />
      </div>

      {/* Tools Section */}
      <div className="flex flex-col gap-[10px] px-0">
        <span className="text-[10px] uppercase tracking-[0.12em] font-bold text-neutral-500 px-2 py-1.5 mt-4">
          Tools
        </span>
        <SidebarItem
          icon={Bell}
          label="Alerts"
          href="/dashboard?tab=alerts"
          badge="3"
        />
        <SidebarItem
          icon={Settings}
          label="Settings"
          href="/dashboard?tab=settings"
        />
      </div>

      {/* Spacer to push account widget to the bottom */}
      <div className="flex-1" />

      {/* Account Widget Card */}
      <div className="p-4 rounded-[20px] bg-gradient-to-b from-neutral-900/80 to-[#0C0C0E]/90 border border-neutral-800/80 flex flex-col gap-3.5 relative overflow-hidden">
        {/* Decorative Green Glow Spot */}
        <div className="absolute -bottom-12 -left-12 size-24 bg-[#22E0A2]/10 blur-[30px] rounded-full pointer-events-none" />

        {/* Card Header & Balance */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
            Free Account
          </span>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold tracking-tight text-white">
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
            <span className="text-neutral-400 font-medium">Daily P&L</span>
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
            icon={Wallet2}
            label="Open P&L"
            subLabel="Today"
            value="$29,995.88"
            iconColorClass="text-[#22E0A2]"
            iconBgClass="bg-emerald-950/20 border-emerald-500/10"
          />
          <CardRow
            icon={Target}
            label="Win Rate"
            subLabel="Last 30 Days"
            value="68.4%"
            iconColorClass="text-blue-400"
            iconBgClass="bg-blue-950/20 border-blue-500/10"
          />
          <CardRow
            icon={Trophy}
            label="Best Asset"
            subLabel="Last 30 Days"
            value="BTCUSD"
            iconColorClass="text-orange-400"
            iconBgClass="bg-orange-950/20 border-orange-500/10"
            valueIcon={
              <span className="size-3.5 flex items-center justify-center rounded-full bg-[#FF8000] text-black text-[9px] font-black shrink-0 shadow-[0_0_6px_rgba(255,128,0,0.3)]">
                ₿
              </span>
            }
          />
        </div>

        {/* Action Button */}
        <Link
          href="/dashboard?tab=analytics"
          className="w-full mt-1 py-2 px-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer group"
        >
          <span className="text-[11px] font-bold text-[#22E0A2] group-hover:text-[#22E0A2]/80 transition-colors">
            View Full Analytics
          </span>
          <ChevronRight className="size-3.5 text-[#22E0A2] group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </aside>
  );
}
