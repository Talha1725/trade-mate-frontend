import { ROUTES } from "@/constant/routes";
import { get, patch, post } from "@/lib/utils/api";
import type {
  SettingsOverviewResponse,
  SettingsAvatarPresignResponse,
} from "@/types/settings";

export type UpdateSettingsProfilePayload = {
  name?: string;
  avatarUrl?: string | null;
};

export type UpdateSettingsPasswordPayload = {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
};

export type CreateSettingsAvatarPresignPayload = {
  fileName: string;
  contentType: string;
};

export const settingsApi = {
  getOverview(accountId?: string | null): Promise<SettingsOverviewResponse> {
    return get(ROUTES.SETTINGS.OVERVIEW, {
      params: accountId ? { accountId } : undefined,
    });
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

  createAvatarPresign(payload: CreateSettingsAvatarPresignPayload) {
    return post<SettingsAvatarPresignResponse>(ROUTES.SETTINGS.AVATAR_PRESIGN, payload);
  },
};
