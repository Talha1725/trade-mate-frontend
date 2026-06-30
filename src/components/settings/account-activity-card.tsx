"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { mockAccountActivityRows } from "@/lib/mock-data/account-activity";
import { cn } from "@/lib/utils";
import type {
  AccountActivityCardProps,
  AccountActivityRow,
} from "@/types/account-activity-card";

function AccountActivityRowValue({
  row,
  onActiveSessionsClick,
}: {
  row: AccountActivityRow;
  onActiveSessionsClick?: () => void;
}) {
  if (row.variant === "sessions") {
    return (
      <button
        type="button"
        onClick={onActiveSessionsClick}
        className="inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-white transition-colors hover:text-white/80"
      >
        {row.value}
        <ChevronRight className="size-4 text-white" />
      </button>
    );
  }

  if (row.variant === "region") {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-white">
        <Image src="/images/usa.svg" alt="Chevron Right" width={18} height={18} />
        <span>{row.regionLabel ?? row.value}</span>
      </div>
    );
  }

  return <p className="text-sm font-medium text-white">{row.value}</p>;
}

function AccountActivityRowItem({
  row,
  onActiveSessionsClick,
}: {
  row: AccountActivityRow;
  onActiveSessionsClick?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <p className="text-sm font-medium text-white/50">{row.label}</p>
      <AccountActivityRowValue
        row={row}
        onActiveSessionsClick={onActiveSessionsClick}
      />
    </div>
  );
}

export function AccountActivityCard({
  title = "Account Activity",
  rows = mockAccountActivityRows,
  onActiveSessionsClick,
  className,
}: AccountActivityCardProps) {
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
          <AccountActivityRowItem
            key={row.id}
            row={row}
            onActiveSessionsClick={onActiveSessionsClick}
          />
        ))}
      </div>
    </article>
  );
}
