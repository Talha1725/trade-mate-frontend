import { ROUTES } from "@/constant/routes"
import { get, post } from "@/lib/utils/api"
import type { AuthSession, LoginCredentials } from "@/types/auth"

export const loginApi = {
  login(credentials: LoginCredentials): Promise<AuthSession> {
    return post(ROUTES.AUTH.LOGIN, credentials)
  },

  me(): Promise<AuthSession> {
    return get(ROUTES.AUTH.ME)
  },

  signout(): Promise<void> {
    return post(ROUTES.AUTH.SIGNOUT)
  },
}
