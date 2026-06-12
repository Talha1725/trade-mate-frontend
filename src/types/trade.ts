export interface Trade {
  id: string;
  symbol: string;
  type: "Buy" | "Sell";
  vol: number;
  openP: number;
  closeP: number;
  profit: number;
  time: string;
  accountId?: string;
  status?: "Open" | "Closed";
}

export interface Position {
  ticket: string;
  symbol: string;
  type: "Buy" | "Sell";
  volume: number;
  openPrice: number;
  sl: number | null;
  tp: number | null;
  current: number;
  profit: number;
}

export type TradeEditorProps = {
  accountId: string;
};
