import { ROUTES } from "@/constant/routes"
import { get, post } from "@/lib/utils/api"
import type { AuthSession, LoginCredentials } from "@/types/auth"

export const loginApi = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const res = await post<{ token: string; user: { id: string; email: string; name: string; role: string } }>(ROUTES.AUTH.LOGIN, credentials)
    if (res.token && typeof window !== "undefined") {
      document.cookie = `token=${res.token}; path=/; max-age=86400; SameSite=Lax`
    }
    return {
      user: {
        id: res.user.id,
        email: res.user.email,
        name: res.user.name || "",
        role: res.user.role.toLowerCase() as "admin" | "trader",
      },
      token: res.token,
    }
  },

  async me(): Promise<AuthSession> {
    const res = await get<{ user: { id: string; email: string; name: string; role: string } }>(ROUTES.AUTH.ME)
    const token = typeof document !== "undefined" ? document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1] : undefined
    return {
      user: {
        id: res.user.id,
        email: res.user.email,
        name: res.user.name || "",
        role: res.user.role.toLowerCase() as "admin" | "trader",
      },
      token,
    }
  },

  async signout(): Promise<void> {
    if (typeof window !== "undefined") {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
  },
}
