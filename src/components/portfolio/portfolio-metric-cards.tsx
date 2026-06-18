"use client";

import Image from "next/image";

import { MiniAreaLineChart } from "@/components/dashboard/mini-area-line-chart";
import { GradientHorizontalProgress } from "@/components/portfolio/gradient-horizontal-progress";
import { SemiCircleDonutGauge } from "@/components/portfolio/semi-circle-donut-gauge";
import { mockPortfolioMetricCards } from "@/lib/mock-data/portfolio-metrics";
import { cn } from "@/lib/utils";
import type {
  PortfolioMetricCard,
  PortfolioMetricCardsProps,
  PortfolioMetricIconCard,
  PortfolioMetricGaugeCard,
  PortfolioMetricSubStat,
} from "@/types/portfolio-metric-card";

function MetricIconBox({
  iconSrc,
  tone,
}: {
  iconSrc: string;
  tone: PortfolioMetricIconCard["iconTone"];
}) {
  return (
    <span
      className={cn(
        "relative flex size-11 shrink-0 items-center justify-center rounded-[10px]!",
        tone === "green" && "btn-green",
        tone === "orange" && "btn-orange",
      )}
    >
      <Image src={iconSrc} alt="" width={20} height={20} unoptimized />
    </span>
  );
}

function SubStatBox({ stat }: { stat: PortfolioMetricSubStat }) {
  return (
    <div className="rounded-[10px] border border-white/20 bg-white/5 backdrop-blur-[2px] px-3 py-2.5">
      <p className="text-sm text-white/60 font-medium">{stat.label}</p>
      <p
        className={cn(
          "mt-1 text-sm font-medium text-white",
          stat.tone === "positive" && "text-primary",
          stat.tone === "negative" && "text-destructive",
        )}
      >
        {stat.value}
      </p>
    </div>
  );
}

function IconStatsCard({ card }: { card: PortfolioMetricIconCard }) {
  const isPositiveSubtitle = card.subtitle?.startsWith("+");

  return (
    <article className="relative flex h-full min-h-[210px] flex-col overflow-hidden rounded-[20px] border border-white/20 bg-white/5 py-4 md:py-6">
      {card.chartValues?.length ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[150px] opacity-90">
          <MiniAreaLineChart
            values={card.chartValues}
            palette="profit"
            showEndDot={false}
            className="h-full w-full"
          />
        </div>
      ) : null}

      <div className="relative z-10 flex items-start justify-between gap-3 px-4 md:px-6">
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-white/60">{card.title}</p>
          <p
            className={cn(
              "text-xl md:text-2xl font-semibold tracking-tight text-white",
              card.valueTone === "positive" && "text-primary",
            )}
          >
            {card.value}
          </p>
          {card.subtitle ? (
            <p
              className={cn(
                "text-xs text-white/60 md:text-sm",
                isPositiveSubtitle && "text-primary font-medium",
              )}
            >
              {card.subtitle}
            </p>
          ) : null}
        </div>

        <MetricIconBox iconSrc={card.iconSrc} tone={card.iconTone} />
      </div>

      <div className="relative z-10 mt-auto grid grid-cols-2 gap-5 pt-3 px-4 md:px-6">
        <SubStatBox stat={card.subStats[0]} />
        <SubStatBox stat={card.subStats[1]} />
      </div>
    </article>
  );
}

function GaugeProgressCard({ card }: { card: PortfolioMetricGaugeCard }) {
  return (
    <article className="flex h-full min-h-[210px] flex-col rounded-[20px] border border-white/20 bg-white/5 p-4 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-white/60">{card.title}</p>
          <p className="text-xl md:text-2xl font-semibold tracking-tight text-white ">
            {card.value}
          </p>
          {card.subtitle ? (
            <p className="text-xs text-white/60 md:text-sm">{card.subtitle}</p>
          ) : null}
        </div>

        <SemiCircleDonutGauge value={card.gaugeValue} size={90} />
      </div>

      <div className="mt-auto pt-3">
        <GradientHorizontalProgress
          value={card.progressValue}
          leftLabel={card.progressLeftLabel}
          rightLabel={card.progressRightLabel}
        />
      </div>
    </article>
  );
}

function PortfolioMetricCardItem({ card }: { card: PortfolioMetricCard }) {
  if (card.variant === "gauge-progress") {
    return <GaugeProgressCard card={card} />;
  }

  return <IconStatsCard card={card} />;
}

export function PortfolioMetricCards({
  cards = mockPortfolioMetricCards,
  className,
}: PortfolioMetricCardsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5",
        className,
      )}
    >
      {cards.map((card) => (
        <PortfolioMetricCardItem key={card.id} card={card} />
      ))}
    </div>
  );
}
