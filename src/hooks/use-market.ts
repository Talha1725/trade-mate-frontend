import { useQuery } from "@tanstack/react-query";
import { terminalApi } from "@/lib/services/terminal.api";

export function useSymbols() {
  return useQuery({
    queryKey: ["market", "symbols"],
    queryFn: () => terminalApi.getMarketSymbols(),
  });
}

export function useQuotes(symbols?: string[]) {
  return useQuery({
    queryKey: ["market", "quotes", symbols],
    queryFn: () => terminalApi.getMarketQuotes(symbols ?? []),
    enabled: !!symbols?.length,
  });
}

export function useHistory(
  symbol: string | null,
  interval?: "1m" | "5m" | "15m" | "1h" | "1d",
) {
  return useQuery({
    queryKey: ["market", "history", symbol, interval],
    queryFn: () => terminalApi.getMarketHistory(symbol!, interval),
    enabled: !!symbol,
  });
}
