import { AnimatePresence, motion } from "motion/react";

/** Passe-partout frame with editorial labels, matching the existing site identity. */
export function EditorialFrame({ step, total = 3 }: { step: number; total?: number }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-3 z-0 border border-line/80 sm:inset-5">
      {/* corner accents */}
      <span className="absolute -left-px -top-px h-9 w-9 border-l border-t border-rose-deep/70 sm:-left-2 sm:-top-2" />
      <span className="absolute -bottom-px -right-px h-9 w-9 border-b border-r border-rose-deep/70 sm:-bottom-2 sm:-right-2" />

      <div className="absolute left-5 top-5 flex items-center gap-3 sm:left-8 sm:top-7">
        <span className="eyebrow text-[9px] text-wine/80">Capítulo 01</span>
        <span className="h-px w-6 bg-line sm:w-8" />
        <span className="font-display text-[15px] italic text-wine/80">O começo de tudo</span>
      </div>

      <div className="absolute right-5 top-5 flex items-center gap-1.5 sm:right-8 sm:top-8">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={`h-[3px] rounded-full transition-all duration-700 ${i < step ? "w-4 bg-wine/70" : "w-1.5 bg-rose-deep/60"}`}
          />
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-5 flex items-center justify-center gap-3 sm:bottom-7">
        <span className="h-px w-8 bg-line" />
        <span className="font-display text-[14px] italic text-rose-ink">Feito com amor, para você.</span>
        <span className="h-px w-8 bg-line" />
      </div>

      <div className="absolute bottom-5 right-5 overflow-hidden font-display text-[14px] italic text-rose-ink sm:bottom-7 sm:right-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={step}
            className="block"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            0{step}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
