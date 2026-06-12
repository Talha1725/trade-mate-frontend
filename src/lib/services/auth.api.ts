import { ROUTES } from "@/constant/routes"
import { post } from "@/lib/utils/api"
import type { AuthLoginResponse, AuthSession, LoginCredentials } from "@/types/auth"

export const loginApi = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await post<AuthLoginResponse>(ROUTES.AUTH.LOGIN, credentials)
    const now = new Date().toISOString()

    return {
      token: response.token,
      user: {
        ...response.user,
        createdAt: now,
      },
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
    }
  },

  logout(): Promise<void> {
    return post(ROUTES.AUTH.LOGOUT)
  },

  refreshToken(): Promise<AuthSession> {
    return post(ROUTES.AUTH.REFRESH)
  },

  forgotPassword(email: string): Promise<void> {
    return post(ROUTES.AUTH.FORGOT_PASSWORD, { email })
  },

  resetPassword(token: string, password: string): Promise<void> {
    return post(ROUTES.AUTH.RESET_PASSWORD, { token, password })
  },
}
