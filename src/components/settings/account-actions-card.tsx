"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

import { mockAccountActions } from "@/lib/mock-data/account-actions";
import { cn } from "@/lib/utils";
import type {
  AccountActionIconTone,
  AccountActionItem,
  AccountActionsCardProps,
} from "@/types/account-actions-card";

function ActionIconBox({
  iconSrc,
  tone,
}: {
  iconSrc: string;
  tone: AccountActionIconTone;
}) {
  return (
    <span
      className={cn(
        "relative flex size-11 shrink-0 items-center justify-center rounded-[8px]!",
        tone === "green" && "btn-green",
        tone === "red" && "btn-red",
        tone === "purple" &&
          "border border-[#A855F7]/35 bg-[radial-gradient(52.13%_193.91%_at_47.87%_100%,rgba(168,85,247,0.35)_0%,rgba(15,23,42,0.12)_100%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]",
      )}
    >
      <Image src={iconSrc} alt="" width={24} height={24} unoptimized />
    </span>
  );
}

function AccountActionTile({
  action,
  onClick,
}: {
  action: AccountActionItem;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full cursor-pointer items-center gap-3 rounded-[12px] border border-white/20 bg-linear-to-b from-[#13131505] to-white/6 p-3.5 text-left transition-colors hover:border-white/30 hover:from-white/10 hover:to-white/5 md:gap-4 md:p-4"
    >
      <ActionIconBox iconSrc={action.iconSrc} tone={action.iconTone} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-normal text-white">{action.title}</p>
        <p className="text-xs text-white/50 md:text-sm">
          {action.description}
        </p>
      </div>

      <ChevronRight className="size-4 shrink-0 text-white transition-transform group-hover:translate-x-0.5 " />
    </button>
  );
}

export function AccountActionsCard({
  title = "Account Actions",
  actions = mockAccountActions,
  onActionClick,
  className,
}: AccountActionsCardProps) {
  return (
    <article
      className={cn(
        "rounded-[20px] border border-white/20 bg-linear-to-b from-white/7 to-white/3 p-4 md:p-6",
        className,
      )}
    >
      <h3 className="text-base font-semibold text-white md:text-lg">{title}</h3>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <AccountActionTile
            key={action.id}
            action={action}
            onClick={() => onActionClick?.(action.id)}
          />
        ))}
      </div>
    </article>
  );
}
