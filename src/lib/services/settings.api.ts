import { ROUTES } from "@/constant/routes";
import { get, patch } from "@/lib/utils/api";
import type { AuthApiUser } from "@/types/auth";
import type {
  SettingsOverviewResponse,
  SettingsOverviewAccount,
} from "@/types/settings";
import type { V2Account, V2AccountListResponse } from "@/types/v2-dashboard";

export type UpdateSettingsProfilePayload = {
  name?: string;
  avatarUrl?: string | null;
};

export type UpdateSettingsPasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
};

function resolveAccount(response: V2AccountListResponse, accountId?: string | null) {
  const accounts = Array.isArray(response) ? response : response.accounts;
  return accountId ? accounts.find((account) => account.id === accountId) ?? null : accounts[0] ?? null;
}

function mapSettingsUser(user: AuthApiUser): SettingsOverviewResponse["user"] {
  return {
    id: user.id,
    email: user.email,
    assignedId: user.assignedId ?? null,
    name: user.name,
    avatarUrl: user.avatarUrl ?? null,
    role: user.role === "admin" ? "ADMIN" : user.role === "trader" ? "TRADER" : user.role,
    isActive: user.isActive ?? true,
    createdAt: user.createdAt ?? new Date().toISOString(),
  };
}

function mapSettingsAccount(account: V2Account): SettingsOverviewResponse["account"] {
  return {
    id: account.id,
    accountNumber: account.accountNumber,
    fundingType: account.fundingType,
    name: account.name,
    type: account.type as SettingsOverviewAccount["type"],
    status: account.status as SettingsOverviewAccount["status"],
    balance: account.balance,
    equity: account.equity,
    floatingPnl: account.floatingPnl,
    marginUsed: account.marginUsed,
    currency: account.currency,
    openPositionsCount: account.trades?.filter((trade) => trade.status === "OPEN").length ?? 0,
  };
}

export const settingsApi = {
  async getOverview(accountId?: string | null): Promise<SettingsOverviewResponse> {
    const [user, accountsResponse] = await Promise.all([
      get<AuthApiUser>(ROUTES.AUTH.ME),
      get<V2AccountListResponse>(ROUTES.ACCOUNT.LIST),
    ]);
    const account = resolveAccount(accountsResponse, accountId);

    return {
      user: mapSettingsUser(user),
      account: account ? mapSettingsAccount(account) : null,
    };
  },

  updateProfile(payload: UpdateSettingsProfilePayload) {
    return patch<SettingsOverviewResponse["user"]>(ROUTES.SETTINGS.PROFILE, payload).then((user) => ({ user }));
  },

  updatePassword(payload: UpdateSettingsPasswordPayload) {
    return patch<{ signedOutSessions: number }>(ROUTES.SETTINGS.PASSWORD, {
      ...payload,
      confirmPassword: payload.confirmPassword ?? payload.newPassword,
    }).then(() => ({ success: true as const }));
  },
};
