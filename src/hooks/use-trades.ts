import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { terminalApi } from "@/lib/services/terminal.api";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { TradeClosePayload, TradeOpenPayload } from "@/types";
import { accountSummaryApi } from "@/lib/services/account-summary.api";

export function usePositions(accountId?: string | null) {
  const token = useAuthStore((state) => state.session?.token ?? null);

  return useQuery({
    queryKey: ["positions", accountId],
    queryFn: () => terminalApi.getOpenPositions(token ?? undefined, accountId ?? undefined),
    enabled: !!token && !!accountId,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
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

export function useAccountSummary(accountId?: string | null) {
  const token = useAuthStore((state) => state.session?.token ?? null);

  return useQuery({
    queryKey: ["account", "summary", accountId],
    enabled: !!token,
    queryFn: () => accountSummaryApi.getAccountSummary(token ?? undefined, accountId ?? undefined),
  });
}
