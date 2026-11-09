import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { Camera, Heart } from "lucide-react";
import { useRef, type ChangeEvent, type PointerEvent } from "react";

import { cn } from "@/lib/utils";

import { Grain } from "./Grain";

type PolaroidProps = {
  photo?: string | null;
  /** When provided, the photo window becomes a local image picker (nothing is uploaded). */
  onPickPhoto?: (url: string) => void;
  /** Subtle 3D tilt that follows the pointer / finger. */
  tilt?: boolean;
  tape?: boolean;
  caption?: string;
  number?: string;
  className?: string;
};

export function Polaroid({
  photo,
  onPickPhoto,
  tilt = false,
  tape = true,
  caption = "Uma história só nossa.",
  number = "Nº 01",
  className,
}: PolaroidProps) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 140, damping: 18, mass: 0.6 };
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), spring);
  const sheenX = useSpring(useTransform(px, [-0.5, 0.5], [20, 80]), spring);
  const sheen = useMotionTemplate`linear-gradient(115deg, transparent ${useTransform(sheenX, (v) => v - 22)}%, oklch(1 0 0 / 0.28) ${sheenX}%, transparent ${useTransform(sheenX, (v) => v + 22)}%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!tilt) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onPickPhoto) onPickPhoto(URL.createObjectURL(file));
    e.target.value = "";
  };

  return (
    <div className={cn("@container relative", className)} style={{ perspective: 1000 }}>
      {/* sheet peeking behind, like a second print in the stack */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-[5%] translate-y-[2.5%] rotate-[5deg] rounded-[2px] bg-paper-shade shadow-paper"
      >
        <Grain strength={0.45} />
      </div>

      <motion.div
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onPointerUp={onLeave}
        style={tilt ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className="relative rounded-[2px] bg-paper px-[6.2%] pb-[24%] pt-[6.2%] shadow-polaroid"
      >
        <Grain strength={0.55} />
        {/* subtle bevel of the card stock */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_oklch(1_0_0/0.9),inset_0_-1px_0_oklch(0.6_0.03_20/0.12)]"
        />

        {/* photo window */}
        <PhotoWindow photo={photo} interactive={!!onPickPhoto} onPick={() => inputRef.current?.click()} />
        {onPickPhoto && (
          <input ref={inputRef} type="file" accept="image/*" className="sr-only" tabIndex={-1} onChange={onFile} />
        )}

        {/* caption */}
        <div className="absolute inset-x-[6.2%] bottom-0 flex h-[24%] items-center justify-center">
          <p className="font-display text-[8.2cqw] italic leading-none tracking-[-0.005em] text-wine">{caption}</p>
          <span className="absolute bottom-[14%] right-0 font-sans text-[2.5cqw] font-medium tracking-[0.22em] text-rose-ink/70">
            {number}
          </span>
        </div>

        {/* moving gloss */}
        {tilt && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
            style={{ backgroundImage: sheen }}
          />
        )}
      </motion.div>

      {tape && <Tape />}
    </div>
  );
}

function PhotoWindow({ photo, interactive, onPick }: { photo?: string | null; interactive: boolean; onPick: () => void }) {
  const Tag = interactive ? "button" : "div";
  return (
    <Tag
      {...(interactive
        ? { type: "button" as const, onClick: onPick, "aria-label": photo ? "Trocar a fotografia" : "Escolher uma fotografia" }
        : {})}
      className={cn(
        "group/photo relative block aspect-square w-full overflow-hidden rounded-[1px] bg-photo-empty text-left",
        "shadow-[inset_0_1px_3px_oklch(0.3_0.05_10/0.28),inset_0_0_0_0.5px_oklch(0.3_0.05_10/0.18)]",
        interactive && "cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-wine/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
      )}
    >
      {photo ? (
        <motion.img
          key={photo}
          src={photo}
          alt="Fotografia escolhida"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0.15, filter: "sepia(0.55) saturate(0.35) brightness(1.55) contrast(0.6) blur(2px)" }}
          animate={{ opacity: 1, filter: "sepia(0.08) saturate(0.92) brightness(1) contrast(1.03) blur(0px)" }}
          transition={{ duration: 3.2, ease: [0.22, 1, 0.36, 1] }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-[10%] text-center">
          <span aria-hidden className="pointer-events-none absolute inset-[6%] border border-paper/55" />
          <Heart className="mb-[5%] size-[9cqw] text-wine/70" strokeWidth={1.1} />
          <p className="font-display text-[8.4cqw] leading-[1.08] text-wine/85">
            O nosso
            <br />
            começo.
          </p>
          <p className="absolute bottom-[12%] font-sans text-[2.35cqw] font-medium uppercase tracking-[0.26em] text-wine/65">
            Um lugar para a nossa foto
          </p>
          {interactive && (
            <span className="absolute right-[9%] top-[9%] flex size-[9cqw] items-center justify-center rounded-full bg-paper/55 text-wine/70 opacity-80 shadow-[0_1px_2px_oklch(0.3_0.05_10/0.15)] transition-all duration-300 group-hover/photo:scale-105 group-hover/photo:bg-paper/80 group-hover/photo:opacity-100">
              <Camera className="size-[4.4cqw]" strokeWidth={1.4} />
            </span>
          )}
        </div>
      )}
      {/* warm film grade + gloss */}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-rose/10 mix-blend-soft-light" />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,oklch(1_0_0/0.22)_0%,oklch(1_0_0/0.06)_32%,transparent_48%)]"
      />
    </Tag>
  );
}

function Tape() {
  return (
    <div
      aria-hidden
      className="absolute -top-[3.2%] left-1/2 h-[8%] w-[36%] -translate-x-1/2 -rotate-[3.5deg]"
      style={{ filter: "drop-shadow(0 1px 1.5px oklch(0.35 0.04 10 / 0.16))" }}
    >
      <div
        className="relative h-full w-full bg-tape backdrop-blur-[1px]"
        style={{
          clipPath:
            "polygon(0 6%, 4% 0, 8% 8%, 12% 1%, 16% 6%, 84% 4%, 88% 0, 92% 7%, 96% 1%, 100% 8%, 100% 94%, 96% 100%, 92% 93%, 88% 99%, 84% 94%, 16% 96%, 12% 100%, 8% 92%, 4% 99%, 0 93%)",
        }}
      >
        <span className="absolute inset-0 grain opacity-40" />
        <span className="absolute inset-0 bg-[linear-gradient(180deg,oklch(1_0_0/0.35),transparent_45%,oklch(0.6_0.04_10/0.08))]" />
      </div>
    </div>
  );
}
