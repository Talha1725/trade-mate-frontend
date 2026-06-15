"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, ShieldCheckIcon, SparklesIcon } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { LoginForm } from "@/components/auth/login-form";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const status = useAuthStore((state) => state.status);
  const loadSession = useAuthStore((state) => state.loadSession);

  React.useEffect(() => {
    if (status === "idle") {
      void loadSession();
    }
  }, [loadSession, status]);

  React.useEffect(() => {
    if (status === "authenticated" && session?.token) {
      router.replace("/dashboard");
    }
  }, [router, session?.token, status]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(98,77,255,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(32,201,151,0.16),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef3fb_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <BrandMark />
          <div className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur sm:flex">
            <ShieldCheckIcon className="size-4 text-emerald-600" />
            Secure user dashboard access
          </div>
        </div>

        <div className="flex flex-1 items-center py-10">
          <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <section className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm backdrop-blur">
                <SparklesIcon className="size-4" />
                Trader access portal
              </div>

              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                  Sign in with your assigned trader ID.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Use the assigned ID and password we gave you to access your
                  Trade Mate dashboard, terminal, and trade history.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
                  <p className="text-sm font-medium text-slate-500">Assigned ID</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">TM-1001</p>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
                  <p className="text-sm font-medium text-slate-500">Access level</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">Trader</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <ArrowRightIcon className="size-4 text-violet-600" />
                After login, you’ll land directly on the dashboard.
              </div>
            </section>

            <section className="mx-auto w-full max-w-md rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-8">
              <LoginForm redirectTo="/dashboard" />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
