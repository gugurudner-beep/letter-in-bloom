import { cn } from "@/lib/utils";

/** Paper grain + fibre overlay. Place inside a `relative` surface. */
export function Grain({ className, strength = 0.5 }: { className?: string; strength?: number }) {
  return (
    <span
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 grain rounded-[inherit]", className)}
      style={{ opacity: strength }}
    />
  );
}
