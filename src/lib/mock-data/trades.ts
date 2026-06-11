import type { Trade } from "@/types/trade";

export const mockTrades: Trade[] = [
  {
    id: "10244",
    symbol: "EURUSD",
    type: "Buy",
    vol: 1.0,
    openP: 1.08,
    closeP: 1.085,
    profit: 50,
    time: "2023-10-25 10:20",
  },
  {
    id: "10243",
    symbol: "GBPUSD",
    type: "Sell",
    vol: 0.5,
    openP: 1.27,
    closeP: 1.275,
    profit: -25,
    time: "2023-10-24 14:15",
  },
  {
    id: "10242",
    symbol: "XAUUSD",
    type: "Buy",
    vol: 0.1,
    openP: 2000,
    closeP: 2050,
    profit: 500,
    time: "2023-10-23 09:30",
  },
  {
    id: "10241",
    symbol: "USDJPY",
    type: "Buy",
    vol: 2.0,
    openP: 150,
    closeP: 151,
    profit: 200,
    time: "2023-10-22 16:45",
  },
  {
    id: "10240",
    symbol: "EURGBP",
    type: "Sell",
    vol: 1.0,
    openP: 0.87,
    closeP: 0.865,
    profit: 50,
    time: "2023-10-21 11:10",
  },
];

export const mockAccountTrades = mockTrades.slice(0, 2);
