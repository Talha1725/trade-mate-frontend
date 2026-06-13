import { loginApi } from "@/lib/services/auth.api";
import type { AuthSession } from "@/types/auth";

const STORAGE_KEY = "public_trader_session";

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
    return null;
  }
}

function persistSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export async function ensurePublicTraderSession(): Promise<AuthSession> {
  const stored = readStoredSession();

  if (stored) {
    return stored;
  }

  const session = await loginApi.demo();
  persistSession(session);
  return session;
}

export function clearPublicTraderSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}
