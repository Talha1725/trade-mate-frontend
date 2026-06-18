"use client";

import { isAxiosError } from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { loginApi } from "@/lib/services/auth.api";
import type { AuthStore } from "@/types";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      session: null,
      status: "idle",
      hasHydrated: false,
      loadSession: async () => {
        set({ status: "loading" });

        try {
          const session = await loginApi.me();
          set({ session, status: "authenticated" });
          return session;
        } catch (error) {
          if (isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 401 || status === 403 || status === 404) {
              set({ session: null, status: "unauthenticated" });
              return null;
            }
          }

          const currentSession = get().session;
          set({ status: currentSession ? "authenticated" : "unauthenticated" });
          return currentSession;
        }
      },
      signIn: async (credentials) => {
        const session = await loginApi.login(credentials);
        set({ session, status: "authenticated" });
        return session;
      },
      signOut: async () => {
        try {
          await loginApi.signout();
        } catch {
          // Clear local auth state even if the server session is already expired.
        } finally {
          set({ session: null, status: "unauthenticated" });
        }
      },
      clearToken: () => {
        set((state) => {
          if (!state.session) return {};
          return {
            session: {
              ...state.session,
              token: undefined,
            },
          };
        });
      },
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "trade-mate-auth",
      storage: createJSONStorage(() => localStorage),
      // Only the session needs to survive a refresh; status is derived on rehydrate.
      partialize: (state) => ({ session: state.session }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.status = state.session ? "authenticated" : "unauthenticated";
        state.setHasHydrated(true);
      },
    },
  ),
);
