import { ROUTES } from "@/constant/routes"
import { get, post } from "@/lib/utils/api"
import type {
  InjectionPreview,
  TradeInjectionPayload,
  TradeInjectionTargetOption,
} from "@/types/admin"

export const injectApi = {
  getInjectionTargets(): Promise<TradeInjectionTargetOption[]> {
    return get(ROUTES.ADMIN.ACCOUNTS)
  },

  previewInjection(payload: TradeInjectionPayload): Promise<InjectionPreview> {
    return post(ROUTES.ADMIN.INJECT, { ...payload, preview: true })
  },

  executeInjection(payload: TradeInjectionPayload): Promise<{ success: boolean; message: string }> {
    return post(ROUTES.ADMIN.INJECT, payload)
  },

  bulkPush(accountIds: string[], tradeData: unknown): Promise<{ success: boolean; affectedAccounts: number }> {
    return post(ROUTES.ADMIN.BULK_PUSH, { accountIds, tradeData })
  },
}
