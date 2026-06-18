"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent p-0.5 transition-colors outline-none",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-0",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "data-[size=default]:h-5 data-[size=default]:w-9",
        "data-[size=sm]:h-[18px] data-[size=sm]:w-8",
        "data-checked:bg-primary data-unchecked:bg-white/10 cursor-pointer",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none flex items-center justify-center rounded-full ring-0 transition-transform",
          "group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3.5",
          "group-data-unchecked/switch:translate-x-0",
          "group-data-[size=default]/switch:group-data-checked/switch:translate-x-4",
          "group-data-[size=sm]/switch:group-data-checked/switch:translate-x-3.5",
          "group-data-checked/switch:bg-white group-data-unchecked/switch:bg-white/50",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "rounded-full",
            "group-data-[size=default]/switch:size-1.5 group-data-[size=sm]/switch:size-1",
            "group-data-checked/switch:bg-primary group-data-unchecked/switch:bg-black/50",
          )}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  )
}

export { Switch }
