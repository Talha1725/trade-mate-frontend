import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { terminalApi } from "@/lib/services/terminal.api";
import { get } from "@/lib/utils/api";
import { ROUTES } from "@/constant/routes";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { AccountMetricsSummary, TradeClosePayload, TradeOpenPayload } from "@/types";

export function usePositions() {
  return useQuery({
    queryKey: ["positions"],
    queryFn: () => terminalApi.getOpenPositions(useAuthStore.getState().session?.token),
  });
}

export function useOpenTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: TradeOpenPayload) => terminalApi.placeOrder(order, useAuthStore.getState().session?.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });
}

export function useCloseTrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TradeClosePayload) =>
      terminalApi.closeTrade(payload, useAuthStore.getState().session?.token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["positions"] });
    },
  });
}

export function useAccountSummary() {
  const token = useAuthStore((state) => state.session?.token ?? null);

  return useQuery({
    queryKey: ["account", "summary"],
    enabled: !!token,
    queryFn: () => get<AccountMetricsSummary>(ROUTES.ACCOUNT.SUMMARY),
  });
}
