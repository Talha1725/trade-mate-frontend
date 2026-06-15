import { ROUTES } from "@/constant/routes"
import { get, post } from "@/lib/utils/api"
import type { AuthSession, LoginCredentials } from "@/types/auth"
import { useAuthStore } from "@/lib/stores/auth-store"

export const loginApi = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const res = await post<{ token: string; user: { id: string; email: string; assignedId?: string; name: string; role: string } }>(ROUTES.AUTH.LOGIN, credentials)
    return {
      user: {
        id: res.user.id,
        email: res.user.email,
        assignedId: res.user.assignedId,
        name: res.user.name || "",
        role: res.user.role.toLowerCase() as "admin" | "trader",
      },
      token: res.token,
    }
  },

  async me(): Promise<AuthSession> {
    const res = await get<{ user: { id: string; email: string; assignedId?: string; name: string; role: string } }>(ROUTES.AUTH.ME)
    const token = useAuthStore.getState().session?.token
    return {
      user: {
        id: res.user.id,
        email: res.user.email,
        assignedId: res.user.assignedId,
        name: res.user.name || "",
        role: res.user.role.toLowerCase() as "admin" | "trader",
      },
      token,
    }
  },

  async signout(): Promise<void> {
    useAuthStore.getState().clearToken()
  },
}
