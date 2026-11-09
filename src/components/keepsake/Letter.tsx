import { motion } from "motion/react";
import { Heart } from "lucide-react";

import { Grain } from "./Grain";

const FOLD = [0.65, 0, 0.35, 1] as const;
const T_TOP = { delay: 0.55, duration: 1.05, ease: FOLD };
const T_BOTTOM = { delay: 1.35, duration: 1.05, ease: FOLD };

/** Full letter face. Rendered once invisibly (to size the sheet) and once per fold panel. */
function LetterFace() {
  return (
    <div className="relative px-7 pb-10 pt-9 sm:px-12 sm:pb-14 sm:pt-12">
      {/* dog-ear */}
      <span
        aria-hidden
        className="absolute right-0 top-0 size-7 bg-[linear-gradient(225deg,var(--ivory)_50%,var(--paper-shade)_50%)] shadow-[-1px_1px_2px_oklch(0.35_0.04_10/0.12)]"
      />

      <header className="flex items-center justify-between pr-6">
        <span className="eyebrow text-rose-ink">Uma carta para você</span>
        <Heart className="size-4 text-wine/80" strokeWidth={1.4} />
      </header>
      <div className="mt-4 h-px bg-line" />

      <p className="mt-6 font-display text-[15px] italic text-rose-ink">Escrita com calma, para ser lida devagar.</p>

      <p className="mt-5 font-display text-[32px] italic leading-none text-wine">Meu amor,</p>

      <div className="mt-5 space-y-4 font-display text-[19px] leading-[1.58] text-ink/90 sm:text-[20.5px]">
        <p className="first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-display first-letter:text-[3.4em] first-letter:leading-[0.78] first-letter:text-wine">
          Este é um espaço reservado para as palavras que só você vai ler. Aqui cabe uma lembrança, um
          agradecimento ou simplesmente aquilo que o coração quiser dizer, escrito com calma e sem pressa.
        </p>
        <p>
          Algumas histórias pedem papel bonito, tinta firme e um envelope selado com cuidado. Não para ficarem
          guardadas numa gaveta, mas para serem relidas sempre que a saudade apertar.
        </p>
        <p>
          Que estas linhas sirvam de abrigo para o que já foi vivido e de convite para tudo o que ainda está
          por vir.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-end">
        <p className="font-script text-[36px] leading-none text-wine sm:text-[40px]">Com amor, sempre.</p>
        <span className="mt-3 h-px w-28 bg-line" />
      </div>

      <div className="mt-10 flex items-center justify-center gap-3 text-rose-deep">
        <span className="h-px w-10 bg-line" />
        <Heart className="size-3" strokeWidth={1.4} />
        <span className="h-px w-10 bg-line" />
      </div>
      <p className="mt-4 text-center font-sans text-[10.5px] leading-relaxed tracking-[0.04em] text-rose-ink/80">
        Texto demonstrativo. Substitua por suas próprias palavras.
      </p>
    </div>
  );
}

/** Tri-fold letter that unfolds when mounted. */
export function Letter() {
  return (
    <motion.article
      aria-label="Carta"
      className="relative w-full"
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* paper body + shadow: grows with the unfolding */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 rounded-[2px] bg-paper shadow-paper"
        initial={{ top: "33.333%", bottom: "33.333%" }}
        animate={{ top: "0%", bottom: "0%" }}
        transition={{ top: T_TOP, bottom: T_BOTTOM }}
      />

      {/* sizing copy */}
      <div aria-hidden className="invisible">
        <LetterFace />
      </div>

      {/* paint order: middle, bottom, top (top folds over everything) */}
      {[1, 2, 0].map((i) => (
        <FoldPanel key={i} index={i as 0 | 1 | 2} />
      ))}

      {/* creases that remain after unfolding */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.3, duration: 0.8 }}
      >
        {[33.333, 66.666].map((t) => (
          <span
            key={t}
            className="absolute inset-x-0 h-[6px] -translate-y-1/2 bg-[linear-gradient(180deg,transparent,oklch(0.45_0.04_15/0.07)_45%,oklch(1_0_0/0.7)_55%,transparent)]"
            style={{ top: `${t}%` }}
          />
        ))}
      </motion.div>
    </motion.article>
  );
}

function FoldPanel({ index }: { index: 0 | 1 | 2 }) {
  const isTop = index === 0;
  const isBottom = index === 2;
  const folds = isTop || isBottom;
  const transition = isTop ? T_TOP : T_BOTTOM;

  return (
    <motion.div
      className="absolute inset-x-0"
      style={{
        top: `${index * 33.3333}%`,
        height: "33.3334%",
        transformOrigin: isTop ? "50% 100%" : "50% 0%",
        transformStyle: "preserve-3d",
        transformPerspective: 1600,
      }}
      initial={folds ? { rotateX: isTop ? -179 : 179 } : false}
      animate={{ rotateX: 0 }}
      transition={transition}
    >
      {/* front: letter slice */}
      <div className="absolute inset-0 overflow-hidden bg-paper backface-hidden">
        <div className="absolute inset-x-0" style={{ top: `-${index * 100}%`, height: "300%" }}>
          <Grain strength={0.5} />
          <LetterFace />
        </div>
        {folds && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background: isTop
                ? "linear-gradient(0deg, oklch(0.35 0.05 10 / 0.35), transparent 70%)"
                : "linear-gradient(180deg, oklch(0.35 0.05 10 / 0.35), transparent 70%)",
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={transition}
          />
        )}
      </div>

      {/* back: outside of the folded sheet */}
      {folds && (
        <div
          className="absolute inset-0 overflow-hidden bg-paper-back backface-hidden"
          style={{ transform: "rotateX(180deg)" }}
        >
          <Grain strength={0.55} />
          {isTop && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <p className="font-script text-[34px] leading-none text-wine">Para você</p>
              <span className="h-px w-16 bg-rose-deep/70" />
            </div>
          )}
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              background: isTop
                ? "linear-gradient(180deg, oklch(0.35 0.05 10 / 0.12), transparent 30%)"
                : "linear-gradient(0deg, oklch(0.35 0.05 10 / 0.1), transparent 30%)",
            }}
          />
        </div>
      )}
    </motion.div>
  );
}
