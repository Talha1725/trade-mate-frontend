"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockHeaderNotifications } from "@/lib/mock-data/header-notifications";
import { cn } from "@/lib/utils";
import type {
  HeaderNotificationItem,
  HeaderNotificationsDropdownProps,
  HeaderNotificationStatus,
} from "@/types/header-notifications";

function StatusBadge({ status }: { status: HeaderNotificationStatus }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-[3px] text-sm font-medium",
        status === "active" &&
        "border-primary/20 bg-primary/10  text-primary",
        status === "triggered" &&
        "border-[#FBB025]/20 bg-[#FBB025]/10 text-[#FBB025]",
      )}
    >
      {status === "active" ? "Active" : "Triggered"}
      <span
        className={cn(
          "size-2 rounded-full",
          status === "active" && "bg-primary shadow-[0_0_8px_rgba(34,224,162,0.95)] animate-pulse",
          status === "triggered" && "bg-[#FBB025] shadow-[0_0_8px_rgba(251,176,37,0.95)] animate-pulse",
        )}
      />
      
    </span>
  );
}

function NotificationTag({ label }: { label: string }) {
  return (
    <span className="rounded-[6px] bg-white/10 px-2 py-[3px] text-xs font-medium text-white/50">
      {label}
    </span>
  );
}

function NotificationRow({
  item,
  onClick,
}: {
  item: HeaderNotificationItem;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full cursor-pointer items-start gap-3 text-left transition-colors rounded-sm hover:bg-white/5"
    >
      <Image src={item.iconSrc} alt="" width={44} height={44} unoptimized />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug text-white">{item.title}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <NotificationTag key={tag} label={tag} />
          ))}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <StatusBadge status={item.status} />
        <span className="text-sm text-white/60">{item.time}</span>
      </div>
    </button>
  );
}

export function HeaderNotificationsDropdown({
  notifications = mockHeaderNotifications,
  onNotificationClick,
  className,
}: HeaderNotificationsDropdownProps) {
  const unreadCount = notifications.filter((item) => item.isUnread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "relative hidden cursor-pointer items-center justify-center rounded-lg border border-border/20 p-2 text-white/60 transition-colors hover:bg-white/5 lg:flex",
          className,
        )}
      >
        <Bell className="size-5" />
        {unreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {unreadCount}
          </span>
        ) : null}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(100vw-2rem,400px)] overflow-hidden rounded-[20px] border border-white/10 bg-black/60 backdrop-blur-sm p-4 md:p-6 shadow-2xl"
      >
        <div className="max-h-[360px] space-y-5">
          {notifications.map((item) => (
            <NotificationRow
              key={item.id}
              item={item}
              onClick={() => onNotificationClick?.(item.id)}
            />
          ))}
        </div>

        <Link
          href="/alerts"
          className="flex w-full items-center justify-center gap-1.5 border border-white/5 bg-linear-to-r from-white/3 to-white/7 px-4 py-2 bg-no-repeat rounded-[10px] text-xs font-medium text-white transition-colors hover:bg-white/10 mt-4 "
        >
          View Alerts
          <ChevronRight className="size-4 text-white/70" />
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
