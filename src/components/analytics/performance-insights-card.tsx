"use client";

import Image from "next/image";

import { mockPerformanceInsights } from "@/lib/mock-data/performance-insights";
import { cn } from "@/lib/utils";
import type {
  PerformanceInsightItem,
  PerformanceInsightsCardProps,
  PerformanceInsightTitleTone,
} from "@/types/performance-insights-card";
import type { PortfolioMetricIconTone } from "@/types/portfolio-metric-card";

function InsightIconBox({
  iconSrc,
  tone,
}: {
  iconSrc: string;
  tone: PortfolioMetricIconTone;
}) {
  return (
    <span
      className={cn(
        "relative flex size-11 shrink-0 items-center justify-center rounded-[8px]!",
        tone === "green" && "btn-green",
        tone === "orange" && "btn-orange",
        tone === "blue" && "btn-blue",
      )}
    >
      <Image src={iconSrc} alt="" width={20} height={20} unoptimized />
    </span>
  );
}

function getTitleToneClass(tone: PerformanceInsightTitleTone) {
  return cn(
    "text-sm font-normal ",
    tone === "green" && "text-primary",
    tone === "orange" && "text-[#FFB265]",
    tone === "blue" && "text-[#60A5FA]",
  );
}

function InsightRow({ item }: { item: PerformanceInsightItem }) {
  return (
    <div className="flex items-center gap-4 rounded-[10px] border border-white/20 bg-linear-to-b from-white/7 to-white/3 p-3.5 md:p-4">
      <InsightIconBox iconSrc={item.iconSrc} tone={item.iconTone} />
      <div className="min-w-0 flex-1">
        <p className={getTitleToneClass(item.titleTone)}>{item.title}</p>
        <p className="text-sm text-white tracking-tight">
          {item.description}
        </p>
      </div>
    </div>
  );
}

export function PerformanceInsightsCard({
  title = "Performance Insights",
  insights = mockPerformanceInsights,
  className,
}: PerformanceInsightsCardProps) {
  return (
    <article
      className={cn(
        "flex h-full flex-col rounded-[20px] border border-white/20 bg-linear-to-b from-[#13131505] to-white/6 p-4 md:p-6",
        className,
      )}
    >
      <h3 className="text-base font-semibold text-white md:text-lg">{title}</h3>

      <div className="mt-4 flex flex-1 flex-col gap-3">
        {insights.map((item) => (
          <InsightRow key={item.id} item={item} />
        ))}
      </div>
    </article>
  );
}
