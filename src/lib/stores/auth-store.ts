"use client";

import { create } from "zustand";

import type { AuthSession, AuthStore } from "@/types";

const STORAGE_KEY = "auth_session";

function readStoredSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.token || !parsed?.user?.email) {
      return null;
    }

    return parsed;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem("auth_token");
    return null;
  }
}

function persistSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  window.localStorage.setItem("auth_token", session.token);
}

function clearStoredSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem("auth_token");
}

export const useAuthStore = create<AuthStore>((set) => ({
  session: readStoredSession(),
  signIn: (session) =>
    set(() => {
      persistSession(session);
      return { session };
    }),
  signOut: () =>
    set(() => {
      clearStoredSession();
      return { session: null };
    }),
}));
