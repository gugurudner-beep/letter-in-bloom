import { motion } from "motion/react";
import { useId } from "react";

import { cn } from "@/lib/utils";

/** Irregular wax-spill outline, generated deterministically (SSR-safe). */
function waxPath(cx: number, cy: number, r: number, n = 64) {
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr =
      r *
      (1 +
        0.034 * Math.sin(5 * a + 0.6) +
        0.022 * Math.sin(9 * a + 1.3) +
        0.012 * Math.sin(17 * a + 2.1));
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  const mid = (p: [number, number], q: [number, number]) =>
    [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2] as const;
  const f = (v: number) => v.toFixed(2);
  const start = mid(pts[n - 1], pts[0]);
  let d = `M${f(start[0])},${f(start[1])}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const m = mid(p, pts[(i + 1) % n]);
    d += ` Q${f(p[0])},${f(p[1])} ${f(m[0])},${f(m[1])}`;
  }
  return d + " Z";
}

const OUTLINE = waxPath(50, 50, 45);
const HEART =
  "M50 64.5 C 38.5 56.5, 33 50, 35 43.2 C 36.8 37.3, 44.6 35.8, 50 42 C 55.4 35.8, 63.2 37.3, 65 43.2 C 67 50, 61.5 56.5, 50 64.5 Z";

function SealArt() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
      <defs>
        <radialGradient id={`wax-${id}`} cx="36%" cy="30%" r="78%">
          <stop offset="0%" stopColor="oklch(0.6 0.11 2)" />
          <stop offset="42%" stopColor="oklch(0.47 0.11 3)" />
          <stop offset="100%" stopColor="oklch(0.33 0.09 3)" />
        </radialGradient>
        <radialGradient id={`press-${id}`} cx="58%" cy="62%" r="70%">
          <stop offset="0%" stopColor="oklch(0.5 0.1 3)" />
          <stop offset="100%" stopColor="oklch(0.4 0.1 3)" />
        </radialGradient>
        <filter id={`drop-${id}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1.6" stdDeviation="1.4" floodColor="oklch(0.25 0.07 5)" floodOpacity="0.45" />
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="oklch(0.3 0.07 5)" floodOpacity="0.22" />
        </filter>
        <filter id={`soft-${id}`}>
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      <path d={OUTLINE} fill={`url(#wax-${id})`} filter={`url(#drop-${id})`} />
      {/* pressed die */}
      <circle cx="50" cy="50" r="31" fill={`url(#press-${id})`} />
      <circle cx="50" cy="50" r="31" fill="none" stroke="oklch(0.28 0.08 3)" strokeOpacity="0.55" strokeWidth="2.2" />
      <circle cx="50.7" cy="51" r="31.6" fill="none" stroke="oklch(0.78 0.07 5)" strokeOpacity="0.4" strokeWidth="0.9" />
      <circle cx="50" cy="50" r="26.5" fill="none" stroke="oklch(0.72 0.07 5)" strokeOpacity="0.28" strokeWidth="0.5" strokeDasharray="0.6 1.6" />
      {/* embossed heart */}
      <path d={HEART} transform="translate(0.7 1)" fill="none" stroke="oklch(0.25 0.08 3)" strokeOpacity="0.6" strokeWidth="2.6" strokeLinejoin="round" />
      <path d={HEART} fill="none" stroke="oklch(0.86 0.06 8)" strokeOpacity="0.88" strokeWidth="2" strokeLinejoin="round" />
      {/* specular */}
      <ellipse cx="34" cy="27" rx="13" ry="5.5" transform="rotate(-32 34 27)" fill="oklch(1 0 0)" opacity="0.2" filter={`url(#soft-${id})`} />
    </svg>
  );
}

const LEFT = "polygon(0 0, 53% 0, 47% 18%, 55% 36%, 46% 55%, 54% 74%, 48% 100%, 0 100%)";
const RIGHT = "polygon(53% 0, 100% 0, 100% 100%, 48% 100%, 54% 74%, 46% 55%, 55% 36%, 47% 18%)";

/** Bordeaux wax seal. When `broken`, it cracks in two and falls away. */
export function WaxSeal({ broken, className }: { broken: boolean; className?: string }) {
  const ease = [0.32, 0, 0.18, 1] as const;
  return (
    <div className={cn("relative aspect-square", className)}>
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: LEFT }}
        animate={broken ? { x: "-14%", y: "34%", rotate: -16, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={broken ? { duration: 0.75, ease, opacity: { delay: 0.25, duration: 0.5 } } : { duration: 0 }}
      >
        <SealArt />
      </motion.div>
      <motion.div
        className="absolute inset-0"
        style={{ clipPath: RIGHT }}
        animate={broken ? { x: "16%", y: "40%", rotate: 14, opacity: 0 } : { x: 0, y: 0, rotate: 0, opacity: 1 }}
        transition={broken ? { duration: 0.8, ease, opacity: { delay: 0.28, duration: 0.5 } } : { duration: 0 }}
      >
        <SealArt />
      </motion.div>
    </div>
  );
}
