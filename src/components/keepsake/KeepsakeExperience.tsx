import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";
import { Heart, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { EditorialFrame } from "./EditorialFrame";
import { Envelope } from "./Envelope";
import { Letter } from "./Letter";
import { Polaroid } from "./Polaroid";

type Stage = "closed" | "opening" | "revealed" | "letter";

const POLAROID_ID = "keepsake-polaroid";
const SOFT = [0.22, 1, 0.36, 1] as const;
const LAYOUT = { layout: { duration: 0.95, ease: SOFT } };

const STEP: Record<Stage, number> = { closed: 1, opening: 1, revealed: 2, letter: 3 };

export function KeepsakeExperience() {
  const [stage, setStage] = useState<Stage>("closed");
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => () => {
    if (photo) URL.revokeObjectURL(photo);
  }, [photo]);

  const open = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.(8);
    setStage("opening");
  }, []);

  const go = (next: Stage) => {
    setStage(next);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const envelopeStage = stage === "closed" || stage === "opening";

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-svh overflow-x-clip bg-page">
        <EditorialFrame step={STEP[stage]} />

        <LayoutGroup>
          <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[560px] flex-col items-center justify-center px-6 pb-24 pt-24 sm:pt-28">
            <AnimatePresence mode="popLayout" initial={false}>
              {envelopeStage && (
                <motion.section
                  key="envelope"
                  className="flex flex-col items-center"
                  exit={{ opacity: 0, y: 70, scale: 0.97, transition: { duration: 0.8, ease: SOFT } }}
                >
                  <motion.div
                    className="text-center"
                    animate={{ opacity: stage === "opening" ? 0 : 1, y: stage === "opening" ? -8 : 0 }}
                    transition={{ duration: 0.5, ease: SOFT }}
                  >
                    <Intro />
                  </motion.div>

                  <motion.div
                    className="group mt-16"
                    initial={{ opacity: 0, y: 24, rotate: -4 }}
                    animate={
                      stage === "opening"
                        ? { opacity: 1, y: 0, rotate: 0, scale: 1 }
                        : { opacity: 1, y: [0, -6, 0], rotate: -4 }
                    }
                    whileTap={{ scale: stage === "closed" ? 0.985 : 1 }}
                    transition={
                      stage === "opening"
                        ? { duration: 0.6, ease: SOFT }
                        : {
                            opacity: { duration: 0.9, ease: SOFT },
                            rotate: { duration: 0.9, ease: SOFT },
                            y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
                          }
                    }
                  >
                    <Envelope
                      opened={stage === "opening"}
                      onOpen={open}
                      onSequenceEnd={() => setStage("revealed")}
                      insertLayoutId={POLAROID_ID}
                      insert={<Polaroid photo={photo} tape={false} />}
                    />
                  </motion.div>

                  <motion.p
                    className="mt-12 flex items-center gap-2 font-display text-[16px] italic text-rose-ink"
                    animate={{ opacity: stage === "opening" ? 0 : 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    Toque no selo para abrir
                  </motion.p>
                </motion.section>
              )}

              {stage === "revealed" && (
                <motion.section key="revealed" className="flex w-full flex-col items-center">
                  <motion.p
                    className="eyebrow mb-9 text-rose-ink"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    Uma lembrança guardada
                  </motion.p>

                  <motion.div
                    layoutId={POLAROID_ID}
                    className="relative z-20 w-[min(76vw,320px)]"
                    animate={{ rotate: -2.5 }}
                    transition={{ ...LAYOUT, rotate: { duration: 1, ease: SOFT } }}
                  >
                    <Polaroid photo={photo} onPickPhoto={setPhoto} tilt />
                  </motion.div>

                  <motion.div
                    className="mt-12 flex flex-col items-center"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.25 } }}
                    transition={{ delay: 0.9, duration: 0.7, ease: SOFT }}
                  >
                    <p className="max-w-[260px] text-center font-sans text-[12.5px] leading-relaxed text-rose-ink">
                      {photo ? "Toque na fotografia para trocá-la." : "Toque na fotografia para escolher uma imagem sua."}
                    </p>
                    <Button variant="keepsake" size="keepsake" className="mt-6" onClick={() => go("letter")}>
                      Abrir a carta
                      <Heart strokeWidth={1.6} />
                    </Button>
                  </motion.div>
                </motion.section>
              )}

              {stage === "letter" && (
                <motion.section key="letter" className="flex w-full flex-col items-center">
                  <motion.div
                    layoutId={POLAROID_ID}
                    className="relative z-20 mb-[-22px] w-[min(44vw,186px)] self-end mr-[2%]"
                    animate={{ rotate: 5 }}
                    transition={{ ...LAYOUT, rotate: { duration: 1, ease: SOFT } }}
                  >
                    <Polaroid photo={photo} />
                  </motion.div>

                  <Letter />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.6, duration: 0.8 }}
                    className="mt-12"
                  >
                    <Button variant="keepsakeLine" size="keepsake" onClick={() => go("closed")}>
                      <RotateCcw strokeWidth={1.5} />
                      Guardar de volta no envelope
                    </Button>
                  </motion.div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </main>
    </MotionConfig>
  );
}

function Intro() {
  return (
    <>
      <p className="eyebrow text-rose-ink">Uma carta para você</p>
      <div className="mt-5 flex items-center justify-center gap-4 text-wine/70">
        <span className="h-px w-10 bg-line" />
        <Heart className="size-4" strokeWidth={1.3} />
        <span className="h-px w-10 bg-line" />
      </div>
      <h1 className="mt-5 font-display text-[44px] font-normal leading-[0.98] tracking-[-0.01em] text-ink sm:text-[56px]">
        Algo guardado
        <br />
        <em className="font-normal text-wine">com carinho.</em>
      </h1>
    </>
  );
}
