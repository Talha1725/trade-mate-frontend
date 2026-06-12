"use client";

import { create } from "zustand";

import type { AuthStore, LoginCredentials, UserRole } from "@/types";

function getRoleFromEmail(email: string): UserRole {
  return email.toLowerCase().includes("admin") ? "admin" : "trader";
}

function createSession(credentials: LoginCredentials) {
  const email = credentials.email.trim();
  const role = getRoleFromEmail(email);

  return {
    user: {
      id: email,
      email,
      name: email.split("@")[0] || "Trader",
      role,
      createdAt: new Date().toISOString(),
    },
    token: `session_${email}`,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8).toISOString(),
  };
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  signIn: (credentials) =>
    set(() => ({
      session: createSession(credentials),
    })),
  signOut: () => set({ session: null }),
}));
