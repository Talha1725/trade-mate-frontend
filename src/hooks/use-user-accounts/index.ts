"use client";

import { useQuery } from "@tanstack/react-query";

import { userAccountsApi } from "@/lib/services/user-accounts.api";
import { useAuthStore } from "@/lib/stores/auth-store";

export function useUserAccounts() {
  const token = useAuthStore((state) => state.session?.token ?? null);

  return useQuery({
    queryKey: ["user", "accounts", token],
    enabled: !!token,
    queryFn: () => userAccountsApi.getAccounts(token ?? undefined),
  });
}

