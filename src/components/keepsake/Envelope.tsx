import { motion } from "motion/react";
import { useEffect, useId, useState, type ReactNode } from "react";

import { WaxSeal } from "./WaxSeal";

const EASE = [0.65, 0, 0.35, 1] as const;
const SOFT = [0.22, 1, 0.36, 1] as const;

/** Timeline (ms) of the opening sequence. */
export const ENVELOPE_TIMING = {
  flap: 420,
  flapBehind: 820,
  rise: 1250,
  done: 2550,
};

type EnvelopeProps = {
  opened: boolean;
  /** Hide the insert so a shared-layout twin can take over. */
  released?: boolean;
  onOpen: () => void;
  onSequenceEnd: () => void;
  insert: ReactNode;
  insertLayoutId: string;
};

export function Envelope({ opened, released, onOpen, onSequenceEnd, insert, insertLayoutId }: EnvelopeProps) {
  const [flapOpen, setFlapOpen] = useState(false);
  const [flapBehind, setFlapBehind] = useState(false);
  const [risen, setRisen] = useState(false);

  useEffect(() => {
    if (!opened) {
      setFlapOpen(false);
      setFlapBehind(false);
      setRisen(false);
      return;
    }
    const t = [
      setTimeout(() => setFlapOpen(true), ENVELOPE_TIMING.flap),
      setTimeout(() => setFlapBehind(true), ENVELOPE_TIMING.flapBehind),
      setTimeout(() => setRisen(true), ENVELOPE_TIMING.rise),
      setTimeout(onSequenceEnd, ENVELOPE_TIMING.done),
    ];
    return () => t.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <div className="relative aspect-[3/2] w-[min(84vw,390px)]">
      {/* contact shadow on the "table" */}
      <div
        aria-hidden
        className="absolute -bottom-5 left-[8%] right-[8%] h-10 rounded-[50%] bg-wine-deep/25 blur-2xl"
      />

      <div className="absolute inset-0 rounded-[3px] shadow-envelope">
        {/* inside back + liner */}
        <EnvelopeInterior />

        {/* insert (photo), clipped at the envelope bottom only */}
        <div className="absolute inset-0 z-10" style={{ clipPath: "inset(-400% -20% 0 -20%)" }}>
          {!released && (
            <motion.div
              layoutId={insertLayoutId}
              className="absolute left-[15%] w-[70%]"
              style={{ top: risen ? "-84%" : "8%" }}
              transition={{ layout: { duration: 1.15, ease: SOFT } }}
            >
              {insert}
            </motion.div>
          )}
        </div>

        {/* front pocket */}
        <EnvelopePocket />

        {/* top flap */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[62%]"
          style={{
            zIndex: flapBehind ? 5 : 30,
            transformOrigin: "50% 0%",
            transformStyle: "preserve-3d",
            transformPerspective: 900,
          }}
          initial={false}
          animate={{ rotateX: flapOpen ? 178 : 0 }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <EnvelopeFlap />
        </motion.div>

        {/* seal */}
        <div className="pointer-events-none absolute left-1/2 top-[56%] z-40 w-[19%] -translate-x-1/2 -translate-y-1/2">
          {!opened && (
            <motion.span
              aria-hidden
              className="absolute inset-[-6%] rounded-full border border-wine/40"
              animate={{ scale: [1, 1.55], opacity: [0.55, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", repeatDelay: 0.6 }}
            />
          )}
          <motion.div
            className="transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:scale-[1.04]"
          >
            <WaxSeal broken={opened} />
          </motion.div>
        </div>

        {/* tap target */}
        {!opened && (
          <button
            type="button"
            onClick={onOpen}
            aria-label="Abrir o envelope"
            className="peer absolute inset-0 z-50 cursor-pointer rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-rose-deep focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          />
        )}
      </div>
    </div>
  );
}

/* ——— SVG layers (viewBox 300 × 200) ——— */

function Liner({ id }: { id: string }) {
  return (
    <pattern id={id} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="7" height="7" fill="oklch(0.91 0.03 12)" />
      <path d="M0 0 V7" stroke="oklch(0.84 0.045 8)" strokeWidth="0.55" />
      <circle cx="3.5" cy="3.5" r="0.55" fill="oklch(0.72 0.07 5)" opacity="0.5" />
    </pattern>
  );
}

function EnvelopeInterior() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 300 200" preserveAspectRatio="none" className="absolute inset-0 z-0 h-full w-full">
      <defs>
        <Liner id={`liner-${id}`} />
        <linearGradient id={`depth-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.35 0.06 8)" stopOpacity="0.28" />
          <stop offset="0.6" stopColor="oklch(0.35 0.06 8)" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <rect width="300" height="200" rx="3" fill="oklch(0.9 0.028 12)" />
      <rect x="9" y="6" width="282" height="190" fill={`url(#liner-${id})`} />
      <rect width="300" height="200" fill={`url(#depth-${id})`} />
    </svg>
  );
}

function EnvelopePocket() {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 300 200"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
    >
      <defs>
        <linearGradient id={`sideL-${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="oklch(0.955 0.017 30)" />
          <stop offset="1" stopColor="oklch(0.925 0.025 18)" />
        </linearGradient>
        <linearGradient id={`sideR-${id}`} x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="oklch(0.945 0.02 25)" />
          <stop offset="1" stopColor="oklch(0.918 0.027 16)" />
        </linearGradient>
        <linearGradient id={`bottom-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="oklch(0.925 0.026 16)" />
          <stop offset="1" stopColor="oklch(0.952 0.018 28)" />
        </linearGradient>
        <filter id={`seam-${id}`} x="-5%" y="-10%" width="110%" height="120%">
          <feDropShadow dx="0" dy="-0.8" stdDeviation="1.1" floodColor="oklch(0.4 0.06 8)" floodOpacity="0.2" />
        </filter>
        <filter id={`seamSide-${id}`} x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="0.6" stdDeviation="1" floodColor="oklch(0.4 0.06 8)" floodOpacity="0.14" />
        </filter>
      </defs>

      <g filter={`url(#seamSide-${id})`}>
        <path d="M0,0 L136,103 Q150,113 136,121 L0,200 Z" fill={`url(#sideL-${id})`} />
        <path d="M300,0 L164,103 Q150,113 164,121 L300,200 Z" fill={`url(#sideR-${id})`} />
      </g>
      <path d="M0,200 L130,110 Q150,97 170,110 L300,200 Z" fill={`url(#bottom-${id})`} filter={`url(#seam-${id})`} />
      {/* paper edge highlights */}
      <path d="M1,1 L136,103" stroke="oklch(1 0 0)" strokeOpacity="0.55" strokeWidth="0.6" fill="none" />
      <path d="M299,1 L164,103" stroke="oklch(1 0 0)" strokeOpacity="0.45" strokeWidth="0.6" fill="none" />
      <path d="M2,199 L130,111 Q150,98 170,111 L298,199" stroke="oklch(1 0 0)" strokeOpacity="0.5" strokeWidth="0.6" fill="none" />
      <rect x="0.4" y="0.4" width="299.2" height="199.2" rx="3" fill="none" stroke="oklch(0.78 0.04 12)" strokeOpacity="0.5" strokeWidth="0.6" />
      <foreignObject x="0" y="0" width="300" height="200">
        <div className="relative h-full w-full mix-blend-multiply">
          <span className="absolute inset-0 grain opacity-40" />
        </div>
      </foreignObject>
    </svg>
  );
}

function EnvelopeFlap() {
  const id = useId().replace(/:/g, "");
  const shape = "M0,0 H300 L167,113 Q150,126 133,113 Z";
  return (
    <>
      {/* front face */}
      <svg
        viewBox="0 0 300 124"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible backface-hidden"
        style={{ filter: "drop-shadow(0 2px 2.5px oklch(0.4 0.06 8 / 0.22)) drop-shadow(0 6px 10px oklch(0.4 0.06 8 / 0.1))" }}
      >
        <defs>
          <linearGradient id={`flap-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.962 0.015 35)" />
            <stop offset="1" stopColor="oklch(0.935 0.024 18)" />
          </linearGradient>
          <clipPath id={`flapClip-${id}`}>
            <path d={shape} />
          </clipPath>
        </defs>
        <path d={shape} fill={`url(#flap-${id})`} />
        <path d="M2,1 L167,113" stroke="none" />
        <path d="M1,0.8 L133,113 M299,0.8 L167,113" stroke="oklch(1 0 0)" strokeOpacity="0.6" strokeWidth="0.7" fill="none" />
        <foreignObject x="0" y="0" width="300" height="124" clipPath={`url(#flapClip-${id})`}>
          <span className="block h-full w-full grain opacity-40" />
        </foreignObject>
      </svg>
      {/* back face (liner) */}
      <svg
        viewBox="0 0 300 124"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full backface-hidden"
        style={{ transform: "rotateX(180deg)" }}
      >
        <defs>
          <Liner id={`flapLiner-${id}`} />
          <linearGradient id={`flapShade-${id}`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="oklch(0.35 0.06 8)" stopOpacity="0.22" />
            <stop offset="1" stopColor="oklch(0.35 0.06 8)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* mirrored vertically because the face is flipped */}
        <g transform="translate(0 124) scale(1 -1)">
          <path d={shape} fill="oklch(0.93 0.022 18)" />
          <path d="M12,4 H288 L165,106 Q150,117 135,106 Z" fill={`url(#flapLiner-${id})`} />
        </g>
        <rect width="300" height="124" fill={`url(#flapShade-${id})`} />
      </svg>
    </>
  );
}
