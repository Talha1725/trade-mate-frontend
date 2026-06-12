import { ROUTES } from "@/constant/routes"
import { post } from "@/lib/utils/api"
import type { AuthSession, LoginCredentials } from "@/types/auth"

export const loginApi = {
  login(credentials: LoginCredentials): Promise<AuthSession> {
    return post(ROUTES.AUTH.LOGIN, credentials)
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
