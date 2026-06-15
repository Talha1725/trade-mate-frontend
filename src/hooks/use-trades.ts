import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { terminalApi } from "@/lib/services/terminal.api";
import { get } from "@/lib/utils/api";
import { ROUTES } from "@/constant/routes";

export function usePositions() {
  return useQuery({
    queryKey: ["positions"],
    queryFn: () => terminalApi.getOpenPositions(),
  });
}

export function useOpenTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: {
      symbol: string;
      type: "Buy" | "Sell";
      volume: number;
      sl?: number;
      tp?: number;
    }) => terminalApi.placeOrder(order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });
}

export function useCloseTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticket: string) => terminalApi.closePosition(ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });
}

export function useAccountSummary() {
  return useQuery({
    queryKey: ["account", "summary"],
    queryFn: () => get<{
      balance: number;
      equity: number;
      floatingPnl: number;
      winRate: number;
    }>(ROUTES.ACCOUNT.SUMMARY),
  });
}
