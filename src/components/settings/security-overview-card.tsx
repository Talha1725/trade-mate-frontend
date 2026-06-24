"use client";

import { RiVerifiedBadgeFill } from "react-icons/ri";

import { mockSecurityOverviewRows } from "@/lib/mock-data/security-overview";
import { cn } from "@/lib/utils";
import type {
  SecurityOverviewCardProps,
  SecurityOverviewRow,
} from "@/types/security-overview-card";

function SecurityOverviewRowItem({
  row,
  onAction,
}: {
  row: SecurityOverviewRow;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center gap-4 py-1.5 first:pt-0 last:pb-0">
      <p className="w-[140px] shrink-0 text-sm text-white/50 md:w-[244px]">
        {row.label}
      </p>

      <div className="flex min-w-0 flex-1 items-center gap-1.5">
        <p
          className={cn(
            "text-sm font-medium",
            row.valueTone === "positive" && "text-primary",
            row.valueTone === "masked" && "tracking-widest text-white/60",
            (!row.valueTone || row.valueTone === "default") && "text-white",
          )}
        >
          {row.value}
        </p>
        {row.showVerifiedIcon ? (
          <RiVerifiedBadgeFill className="size-4 shrink-0 text-primary" />
        ) : null}
      </div>

      {row.actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex shrink-0 cursor-pointer items-center rounded-[10px] border border-white/5 bg-linear-to-b from-white/7 to-white/3 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
        >
          {row.actionLabel}
        </button>
      ) : (
        <span className="hidden w-[88px] shrink-0 sm:block" aria-hidden />
      )}
    </div>
  );
}

export function SecurityOverviewCard({
  title = "Security Overview",
  rows = mockSecurityOverviewRows,
  onChangePassword,
  onManageEmailVerification,
  onManageLoginAlerts,
  className,
}: SecurityOverviewCardProps) {
  const actionHandlers: Record<string, (() => void) | undefined> = {
    password: onChangePassword,
    "email-verification": onManageEmailVerification,
    "login-alerts": onManageLoginAlerts,
  };

  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[20px] border border-white/20 bg-linear-to-b from-white/7 to-white/3 p-4 md:p-6",
        className,
      )}
    >
      <h3 className="text-base font-semibold text-white md:text-lg">{title}</h3>
      <div className="mt-6 flex flex-col">
        {rows.map((row) => (
          <SecurityOverviewRowItem
            key={row.id}
            row={row}
            onAction={actionHandlers[row.id]}
          />
        ))}
      </div>
    </article>
  );
}
