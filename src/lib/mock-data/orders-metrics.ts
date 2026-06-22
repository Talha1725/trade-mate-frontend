import type { OrdersMetricCard } from "@/types/orders-metric-card";

export const mockAverageSlippageChartValues = [
  0.04, 0.05, 0.045, 0.055, 0.05, 0.06, 0.058, 0.065, 0.07, 0.068, 0.075, 0.08,
];

export const mockOrdersMetricCards: OrdersMetricCard[] = [
  {
    id: "pending-orders",
    variant: "icon",
    title: "Pending Orders",
    value: "2",
    subtitle: "Awaiting fill",
    iconSrc: "/images/orders/pending.svg",
  },
  {
    id: "today-filled",
    variant: "icon",
    title: "Today Filled",
    value: "14",
    subtitle: "+5 vs yesterday",
    subtitleTone: "positive",
    iconSrc: "/images/orders/filled.svg",
  },
  {
    id: "average-slippage",
    variant: "chart",
    title: "Average Slippage",
    value: "0.08%",
    subtitle: "Very low execution drag",
    chartValues: mockAverageSlippageChartValues,
  },
  {
    id: "risk-utilization",
    variant: "icon",
    title: "Risk Utilization",
    value: "41%",
    subtitle: "Within daily threshold",
    valueTone: "positive",
    iconSrc: "/images/orders/risk.svg",
  },
];
