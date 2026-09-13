import { ROUTES } from "@/constant/routes"
import { get, post } from "@/lib/utils/api"
import type {
  AuthApiUser,
  AuthLoginResponse,
  AuthSession,
  ForgotPasswordResponse,
  LoginCredentials,
  ResetPasswordInput,
  ResetPasswordResponse,
} from "@/types/auth"
import { useAuthStore } from "@/lib/stores/auth-store"

function mapAuthUser(user: AuthApiUser): AuthSession["user"] {
  return {
    id: user.id,
    email: user.email,
    assignedId: user.assignedId,
    name: user.name || "",
    role: user.role.toLowerCase() as "admin" | "trader",
    avatarUrl: user.avatarUrl ?? null,
    createdAt: user.createdAt,
  }
}

export const loginApi = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const res = await post<AuthLoginResponse>(ROUTES.AUTH.LOGIN, credentials)
    return {
      user: mapAuthUser(res.user),
      token: res.accessToken,
      expiresAt: res.expiresAt,
    }
  },

  async me(): Promise<AuthSession> {
    const user = await get<AuthApiUser>(ROUTES.AUTH.ME)
    const token = useAuthStore.getState().session?.token
    return {
      user: mapAuthUser(user),
      token,
      expiresAt: useAuthStore.getState().session?.expiresAt,
    }
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    await post<null>(ROUTES.AUTH.FORGOT_PASSWORD, {
      email: email.trim().toLowerCase(),
    })
    return {
      success: true,
      message: "If that email is registered, a reset link has been sent.",
    }
  },

  async resetPassword(input: ResetPasswordInput): Promise<ResetPasswordResponse> {
    await post<null>(ROUTES.AUTH.RESET_PASSWORD, {
      ...input,
      confirmPassword: input.confirmPassword ?? input.password,
    })
    return {
      success: true,
      message: "Password updated. You can sign in now.",
    }
  },

  async signout(): Promise<void> {
    try {
      await post<null>("/api/auth/logout")
    } finally {
      useAuthStore.getState().clearToken()
    }
  },
}
