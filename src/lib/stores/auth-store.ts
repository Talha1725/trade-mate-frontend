"use client";

import { create } from "zustand";

import { loginApi } from "@/lib/services/auth.api";
import type { AuthStore } from "@/types";

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  status: "idle",
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
}));
