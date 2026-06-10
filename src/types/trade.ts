export interface Trade {
  id: string;
  symbol: string;
  type: "Buy" | "Sell";
  vol: number;
  openP: number;
  closeP: number;
  profit: number;
  time: string;
}
