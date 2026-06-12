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
    queryFn: () => terminalApi.getMarketQuotes(),
    enabled: true,
  });
}

export function useHistory(symbol: string | null, interval?: string) {
  return useQuery({
    queryKey: ["market", "history", symbol, interval],
    queryFn: () => terminalApi.getMarketHistory(symbol!, interval),
    enabled: !!symbol,
  });
}
