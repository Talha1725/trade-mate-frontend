"use client";

import Image from "next/image";

import { MiniAreaLineChart } from "@/components/dashboard/mini-area-line-chart";
import { mockOrdersMetricCards } from "@/lib/mock-data/orders-metrics";
import { cn } from "@/lib/utils";
import type {
  OrdersMetricCard,
  OrdersMetricCardsProps,
} from "@/types/orders-metric-card";

function MetricIconBox({ iconSrc }: { iconSrc: string }) {
  return (
    <span className="relative flex size-11 shrink-0 items-center justify-center rounded-[10px] btn-green">
      <Image src={iconSrc} alt="" width={20} height={20} unoptimized style={{
        width: "auto",
        height: "auto",
      }} />
    </span>
  );
}

function MetricChartBox({ values }: { values: number[] }) {
  return (
    <div className="h-14 w-24 shrink-0">
      <MiniAreaLineChart
        values={values}
        palette="profit"
        showEndDot
        className="h-full w-full"
      />
    </div>
  );
}

function OrdersMetricCardItem({ card }: { card: OrdersMetricCard }) {
  const isPositiveSubtitle =
    card.variant === "icon" && card.subtitleTone === "positive";
  const isPositiveValue = card.variant === "icon" && card.valueTone === "positive";

  return (
    <article className="flex min-h-[120px] items-start justify-between gap-4 rounded-[20px] border border-white/20 bg-white/5 p-4 md:p-6">
      <div className="min-w-0 space-y-1">
        <p className="text-sm text-white/60">{card.title}</p>
        <p
          className={cn(
            "text-xl font-medium tracking-tight text-white md:text-2xl",
            isPositiveValue && "text-primary",
          )}
        >
          {card.value}
        </p>
        <p
          className={cn(
            "text-xs text-white/60 md:text-sm",
            isPositiveSubtitle && "text-primary",
          )}
        >
          {card.subtitle}
        </p>
      </div>

      {card.variant === "chart" ? (
        <MetricChartBox values={card.chartValues} />
      ) : (
        <MetricIconBox iconSrc={card.iconSrc} />
      )}
    </article>
  );
}

export function OrdersMetricCards({
  cards = mockOrdersMetricCards,
  className,
}: OrdersMetricCardsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {cards.map((card) => (
        <OrdersMetricCardItem key={card.id} card={card} />
      ))}
    </div>
  );
}
