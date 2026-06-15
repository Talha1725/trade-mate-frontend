"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { loginApi } from "@/lib/services/auth.api";
import type { AuthStore } from "@/types";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      status: "idle",
      hasHydrated: false,
      loadSession: async () => {
        set({ status: "loading" });

        try {
          const session = await loginApi.me();
          set({ session, status: "authenticated" });
          return session;
        } catch {
          set({ session: null, status: "unauthenticated" });
          return null;
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
