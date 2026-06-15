"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { BrandMark } from "@/components/brand-mark";
import { LoginForm } from "@/components/auth/login-form";
import { ADMIN_NAV_ITEMS } from "@/constant/nav-config";
import { useAuthStore } from "@/lib/stores/auth-store";
import type { AdminLayoutProps } from "@/types/admin";

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useAuthStore((state) => state.session);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const isAdmin = session?.user.role === "admin";

  React.useEffect(() => {
    // Wait until the persisted session has been read back from storage so a
    // refresh doesn't momentarily look unauthenticated and redirect away.
    if (!hasHydrated) return;

    if (pathname !== "/admin" && !session) {
      router.replace("/dashboard");
      return;
    }

    if (session && !isAdmin) {
      router.replace("/dashboard");
    }
  }, [hasHydrated, isAdmin, pathname, router, session]);

  // Avoid rendering (and flashing the login screen) before hydration completes.
  if (!hasHydrated) {
    return null;
  }

  if (!session || !isAdmin) {
    if (pathname !== "/admin") {
      return null;
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] px-4 font-sans text-[#1a1a1a]">
        <div className="mb-8">
          <BrandMark />
        </div>
        <div className="w-full max-w-[420px] rounded-2xl border border-gray-200 bg-white p-8 shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
          <LoginForm redirectTo="/admin" />
        </div>
      </main>
    );
  }

  return (
    <AppShell
      navItems={ADMIN_NAV_ITEMS}
      userLabel={session.user.email}
      onSignOut={() => router.replace("/dashboard")}
    >
      <div className="flex w-full flex-col gap-2">{children}</div>
    </AppShell>
  );
}
