import type {
  EquityCurveDatum,
  PositionSummary,
  RecentActivityItem,
  StatCardDatum,
  SymbolBreakdownDatum,
} from "@/types/dashboard";

export const mockSymbolBreakdown: SymbolBreakdownDatum[] = [
  { name: "EURUSD", value: 400 },
  { name: "GBPUSD", value: 300 },
  { name: "XAUUSD", value: 300 },
  { name: "USDJPY", value: 200 },
];

export const mockSymbolBreakdownColors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];

export const mockEquityCurve: EquityCurveDatum[] = [
  { name: "Mon", equity: 10000 },
  { name: "Tue", equity: 10200 },
  { name: "Wed", equity: 10150 },
  { name: "Thu", equity: 10500 },
  { name: "Fri", equity: 10400 },
  { name: "Sat", equity: 11000 },
  { name: "Sun", equity: 12450 },
];

export const mockPositionSummary: PositionSummary[] = [
  { symbol: "EURUSD", type: "Buy", volume: 1.0, profit: 45.2 },
  { symbol: "GBPUSD", type: "Sell", volume: 0.5, profit: -12.5 },
  { symbol: "XAUUSD", type: "Buy", volume: 0.1, profit: 150 },
];

export const mockRecentActivity: RecentActivityItem[] = [
  { symbol: "EURUSD", action: "Buy", price: 1.085, dateLabel: "10 mins ago" },
  { symbol: "GBPUSD", action: "Sell", price: 1.264, dateLabel: "1 hr ago" },
  { symbol: "XAUUSD", action: "Close Buy", price: 2045.5, dateLabel: "3 hrs ago" },
];

export const mockStatCards: StatCardDatum[] = [
  { title: "Account Balance", value: "$12,450.80", description: "+2.3% from last month" },
  { title: "Open Positions", value: "4", description: "2 long / 2 short" },
  { title: "Today's P&L", value: "+$184.20", description: "+1.5% today", tone: "success" },
  { title: "Win Rate", value: "68%", description: "Last 30 trades" },
];
