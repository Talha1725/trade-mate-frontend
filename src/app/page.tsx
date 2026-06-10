import { ArrowRightIcon, BarChart3Icon, Layers3Icon, ShieldCheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_30%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
              <Layers3Icon className="size-4" />
              Trade Mate project initialized
            </div>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                A trading platform foundation with Next.js, shadcn/ui, and a clean
                feature-first structure.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                The app is set up to keep routes in `src/app`, shared UI in
                `src/components`, reusable primitives in `src/components/ui`, and
                shared TypeScript types in `src/types`.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button className="gap-2">
                View structure
                <ArrowRightIcon className="size-4" />
              </Button>
              <Button variant="outline" className="gap-2">
                <ShieldCheckIcon className="size-4" />
                shadcn installed
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200/60 backdrop-blur">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">Project layout</p>
                <BarChart3Icon className="size-4 text-slate-500" />
              </div>
              <div className="space-y-3 text-sm">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="font-medium">src/app</span> - routes, layouts,
                  and API handlers
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="font-medium">src/components/ui</span> - shadcn
                  primitives
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="font-medium">src/features</span> - feature
                  workflows
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="font-medium">src/types</span> - shared types
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
