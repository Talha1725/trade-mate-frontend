import { cn } from "@/lib/utils";
import type { GradientHorizontalProgressProps } from "@/types/gradient-horizontal-progress";

const GRADIENT_FILL = "linear-gradient(180deg, #0CE9A0 0%, #108961 100%)";

export function GradientHorizontalProgress({
  value,
  leftLabel,
  rightLabel,
  className,
  trackClassName,
  fill = GRADIENT_FILL,
}: GradientHorizontalProgressProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const hasFooter = Boolean(leftLabel || rightLabel);

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "h-1.5 w-full overflow-hidden rounded-full bg-white/20",
          trackClassName,
        )}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${clampedValue}%`,
            background: fill,
          }}
        />
      </div>

      {hasFooter ? (
        <div className="flex items-center justify-between gap-2 text-xs text-white/60">
          <span className="font-medium">{leftLabel}</span>
          <span className="text-white font-semibold">{rightLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
