"use client";
import type { ReactNode } from "react";
import { mockSubscriptionPlan } from "@/lib/mock-data/subscription-plan";
import { cn } from "@/lib/utils";
import type { SubscriptionPlanCardProps } from "@/types/subscription-plan-card";
import { FaClipboardList } from "react-icons/fa6";

function ActivePlanBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
      {label}
      <span className="size-2 animate-pulse rounded-full bg-primary shadow-[0_0_8px_2px_rgba(34,224,162,1.0)]" />
    </span>
  );
}

function InnerCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-white/20 bg-linear-to-br from-white/7 to-white/5 p-4 backdrop-blur-xs ",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SubscriptionPlanCard({
  title = "Subscription & Plan",
  planName = mockSubscriptionPlan.planName,
  planStatusLabel = mockSubscriptionPlan.planStatusLabel,
  renewsOn = mockSubscriptionPlan.renewsOn,
  monthlyFee = mockSubscriptionPlan.monthlyFee,
  managePlanLabel = "Manage Plan",
  billingHistoryLabel = "Billing History",
  viewHistoryLabel = "View History",
  onManagePlan,
  onViewHistory,
  className,
}: SubscriptionPlanCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[20px] border border-white/20 bg-linear-to-b from-white/7 to-white/3 p-4 md:p-6",
        className,
      )}
    >
      <h3 className="text-base font-semibold text-white md:text-lg">{title}</h3>
      <div className="mt-6 flex flex-col gap-4">
        <InnerCard>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 ">
              <p className="text-sm font-medium text-white/60">Current Plan</p>
              <div className="mt-1 flex flex-wrap items-center gap-2.5">
                <p className="text-base font-medium text-white md:text-lg">
                  {planName}
                </p>
                <ActivePlanBadge label={planStatusLabel} />
              </div>
              <p className="mt-1.5 font-medium text-sm text-white/60">
                Renews on <span className=" text-white">{renewsOn}</span>
              </p>
            </div>

            <div className="lg:px-4">
              <p className="text-sm font-medium text-white/60">Monthly Fee</p>
              <p className="mt-1 text-base font-medium text-white md:text-lg">
                {monthlyFee}
              </p>
            </div>

            <button
              type="button"
              onClick={onManagePlan}
              className="inline-flex shrink-0 cursor-pointer items-center self-start rounded-[10px] border border-white/5 bg-linear-to-b from-white/7 to-white/3 px-4 py-1.25 text-sm font-medium text-white/50 transition-colors hover:bg-white/10 hover:text-white/70 lg:self-center"
            >
              {managePlanLabel}
            </button>
          </div>
        </InnerCard>

        <InnerCard>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-white">
              {billingHistoryLabel}
            </p>

            <button
              type="button"
              onClick={onViewHistory}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 self-start rounded-[10px] border border-white/5 bg-linear-to-b from-white/7 to-white/3 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/10 sm:self-center"
            >
              <FaClipboardList  className="size-4 text-white" />
              {viewHistoryLabel}
            </button>
          </div>
        </InnerCard>
      </div>
    </article>
  );
}
