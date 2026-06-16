"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      position="bottom-right"
      theme={theme as ToasterProps["theme"]}
      richColors={false}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--background)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "14px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast flex items-start gap-3 rounded-xl border px-4 py-3 text-sm backdrop-blur",
          title: "!text-current font-medium leading-5",
          description: "!text-current/80 font-normal leading-5",
          default:
            "!bg-background/95 !border-border/70 !text-foreground shadow-lg shadow-black/5",
          success:
            "!bg-emerald-50 !border-emerald-200 !text-emerald-900 dark:!bg-emerald-950/60 dark:!border-emerald-700/50 dark:!text-emerald-200",
          info:
            "!bg-blue-50 !border-blue-200 !text-blue-900 dark:!bg-blue-950/60 dark:!border-blue-700/50 dark:!text-blue-200",
          warning:
            "!bg-amber-50 !border-amber-200 !text-amber-900 dark:!bg-amber-950/60 dark:!border-amber-700/50 dark:!text-amber-200",
          error:
            "!bg-rose-50 !border-rose-200 !text-rose-900 dark:!bg-rose-950/60 dark:!border-rose-700/50 dark:!text-rose-200",
          loading:
            "!bg-slate-50 !border-slate-200 !text-slate-900 dark:!bg-slate-950/60 dark:!border-slate-700/50 dark:!text-slate-200",
          actionButton:
            "rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground shadow-none",
          cancelButton:
            "rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-none",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
