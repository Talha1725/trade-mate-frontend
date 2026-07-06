"use client";

import Image from "next/image";
import { Target, Trophy } from "lucide-react";
import { FaArrowTrendDown } from "react-icons/fa6";
import { LuChartSpline } from "react-icons/lu";

import { MiniAreaLineChart } from "@/components/dashboard/mini-area-line-chart";
import { GradientHorizontalProgress } from "@/components/portfolio/gradient-horizontal-progress";
import { SemiCircleDonutGauge } from "@/components/portfolio/semi-circle-donut-gauge";

import { cn } from "@/lib/utils";
import type {
  PortfolioMetricCard,
  PortfolioMetricCardsProps,
  PortfolioMetricIconCard,
  PortfolioMetricGaugeCard,
  PortfolioMetricIconKind,
  PortfolioMetricSubStat,
} from "@/types/portfolio-metric-card";

function MetricIconBox({
  iconSrc,
  iconKind = "image",
  tone,
}: {
  iconSrc?: string;
  iconKind?: PortfolioMetricIconKind;
  tone: PortfolioMetricIconCard["iconTone"];
}) {
  const IconComponent =
    iconKind === "chart-spline"
      ? LuChartSpline
      : iconKind === "trend-down"
        ? FaArrowTrendDown
        : iconKind === "target"
          ? Target
          : iconKind === "trophy"
            ? Trophy
            : null;

  return (
    <span
      className={cn(
        "relative flex size-11 shrink-0 items-center justify-center rounded-[10px]!",
        tone === "green" && "btn-green",
        tone === "orange" && "btn-orange",
        tone === "red" && "btn-red",
        tone === "blue" && "btn-blue",
      )}
    >
      {IconComponent ? (
        <IconComponent className="size-5 text-white" />
      ) : iconSrc ? (
        <Image src={iconSrc} alt="" width={20} height={20} unoptimized style={{
          width: "auto",
          height: "auto",
        }} />
      ) : null}
    </span>
  );
}

function SubStatBox({ stat }: { stat: PortfolioMetricSubStat }) {
  return (
    <div className="rounded-[10px] border border-white/20 bg-white/5 backdrop-blur-sm px-3 py-2.5">
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
  const subtitleTone =
    card.subtitleTone ??
    (card.subtitle?.startsWith("+") ? "positive" : card.subtitle?.startsWith("-") ? "negative" : "default");

  return (
    <article className="relative flex h-full min-h-[210px] flex-col overflow-hidden rounded-[20px] border border-white/20 bg-linear-to-b from-white/7 to-white/3 py-4">
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

      <div className="relative z-10 flex items-start justify-between gap-3 px-4">
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-white/60">{card.title}</p>
          <p
            className={cn(
              "text-xl md:text-2xl font-semibold tracking-tight text-white",
              card.valueTone === "positive" && "text-primary",
              card.valueTone === "negative" && "text-destructive",
            )}
          >
            {card.value}
          </p>
          {card.subtitle ? (
            <p
              className={cn(
                "text-xs text-white/60 md:text-sm",
                subtitleTone === "positive" && "text-primary font-medium",
                subtitleTone === "negative" && "text-destructive font-medium",
              )}
            >
              {card.subtitle}
            </p>
          ) : null}
        </div>

        <MetricIconBox
          iconSrc={card.iconSrc}
          iconKind={card.iconKind}
          tone={card.iconTone}
        />
      </div>

      <div className="relative z-10 mt-auto grid grid-cols-2 gap-5 pt-3 px-4 ">
        <SubStatBox stat={card.subStats[0]} />
        <SubStatBox stat={card.subStats[1]} />
      </div>
    </article>
  );
}

function GaugeProgressCard({ card }: { card: PortfolioMetricGaugeCard }) {
  return (
    <article className="flex h-full min-h-[210px] flex-col rounded-[20px] border border-white/20 bg-linear-to-b from-white/7 to-white/3 p-4">
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
  cards = [],
  className,
}: PortfolioMetricCardsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 min-[1700px]:grid-cols-5! ",
        className,
      )}
    >
      {cards.map((card) => (
        <PortfolioMetricCardItem key={card.id} card={card} />
      ))}
    </div>
  );
}
