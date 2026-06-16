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
            "group toast flex items-start gap-3 rounded-xl border border-border/70 bg-background/95 px-4 py-3 text-sm text-foreground shadow-lg shadow-black/5 backdrop-blur",
          title: "font-medium leading-5",
          description: "text-muted-foreground font-normal leading-5",
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
