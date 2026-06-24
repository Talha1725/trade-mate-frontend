import type { PerformanceInsightItem } from "@/types/performance-insights-card";

export const PERFORMANCE_INSIGHTS_ROCKET_ICON = "/images/analytics/rocket.svg";
export const PERFORMANCE_INSIGHTS_SECURITY_ICON = "/images/analytics/security.svg";
export const PERFORMANCE_INSIGHTS_FOCUS_ICON = "/images/analytics/focus.svg";

export const mockPerformanceInsights: PerformanceInsightItem[] = [
  {
    id: "best-setup",
    title: "Best Setup",
    titleTone: "green",
    description:
      "Breakout + Retest, 71.4% win rate and highest expectancy this month.",
    iconSrc: PERFORMANCE_INSIGHTS_ROCKET_ICON,
    iconTone: "green",
  },
  {
    id: "rule-breaches",
    title: "Rule breaches",
    titleTone: "orange",
    description:
      "2 this month. Reduce overtrading during Asian session and avoid revenge setups.",
    iconSrc: PERFORMANCE_INSIGHTS_SECURITY_ICON,
    iconTone: "orange",
  },
  {
    id: "next-focus",
    title: "Next focus",
    titleTone: "blue",
    description:
      "Scale BTC / ETH setups and keep drawdown below 5% to improve payout consistency.",
    iconSrc: PERFORMANCE_INSIGHTS_FOCUS_ICON,
    iconTone: "blue",
  },
];
