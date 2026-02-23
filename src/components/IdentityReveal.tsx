"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IdentityRevealProps {
  onComplete?: () => void;
}

// Typewriter hook
function useTypewriter(text: string, speed: number, startDelay: number) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setIsDone(false);

    const delayTimer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setIsDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(delayTimer);
  }, [text, speed, startDelay]);

  return { displayed, isDone };
}

// Particle component
function Particle({ delay, x, size }: { delay: number; x: number; size: number }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        left: `${x}%`,
        bottom: "10%",
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(140, 160, 255, 0.8) 0%, rgba(120, 100, 255, 0.4) 50%, transparent 100%)`,
        animation: `particle-drift ${3 + Math.random() * 2}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

export default function IdentityReveal({ onComplete }: IdentityRevealProps) {
  const [phase, setPhase] = useState<"dim" | "particles" | "card" | "text">("dim");
  const [showCharacter, setShowCharacter] = useState(false);
  const [warpFlash, setWarpFlash] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleText = "Strategic Navigator";
  const descText = "A leader who structures complexity and charts clear direction.";

  const title = useTypewriter(titleText, 60, phase === "text" ? 0 : 99999);
  const description = useTypewriter(descText, 30, phase === "text" ? titleText.length * 60 + 400 : 99999);

  // Particles data — generate once
  const particlesRef = useRef(
    Array.from({ length: 24 }, (_, i) => ({
      id: i,
      delay: Math.random() * 3,
      x: Math.random() * 100,
      size: 1.5 + Math.random() * 2.5,
    }))
  );

  // Sequenced reveal
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("particles"), 600);
    const t2 = setTimeout(() => setPhase("card"), 1200);
    const t3 = setTimeout(() => setPhase("text"), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Warp flash → fullscreen character after description typing finishes
  useEffect(() => {
    if (description.isDone) {
      // Brief pause, then warp flash
      const t1 = setTimeout(() => setWarpFlash(true), 800);
      // Character appears after flash peaks
      const t2 = setTimeout(() => {
        setShowCharacter(true);
        videoRef.current?.play();
      }, 1400);
      // Flash fades
      const t3 = setTimeout(() => setWarpFlash(false), 2000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [description.isDone]);

  return (
    <motion.div
      className="relative w-screen h-screen overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Dim background glow */}
      <div
        className="absolute inset-0 z-[0]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(30, 40, 80, 0.3) 0%, rgba(10, 10, 30, 0.6) 40%, rgba(0, 0, 0, 0.95) 80%)",
        }}
      />

      {/* Subtle ambient light shifts */}
      <motion.div
        className="absolute inset-0 z-[1] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase !== "dim" ? 1 : 0 }}
        transition={{ duration: 1.5 }}
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(80, 100, 200, 0.08) 0%, transparent 60%)",
        }}
      />

      {/* Particles layer — hidden once character shows */}
      <motion.div
        className="absolute inset-0 z-[2] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase !== "dim" && !showCharacter ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      >
        {particlesRef.current.map((p) => (
          <Particle key={p.id} delay={p.delay} x={p.x} size={p.size} />
        ))}
      </motion.div>

      {/* Holographic identity card — fades out when character appears */}
      <AnimatePresence>
        {!showCharacter && (
          <motion.div
            className="absolute inset-0 z-[5] flex flex-col items-center justify-center px-6"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeIn" }}
          >
            <motion.div
              className="relative w-full max-w-[560px]"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{
                opacity: phase === "dim" || phase === "particles" ? 0 : 1,
                y: phase === "dim" || phase === "particles" ? 40 : 0,
                scale: phase === "dim" || phase === "particles" ? 0.95 : 1,
              }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Outer glow layer */}
              <div
                className="absolute -inset-[1px] rounded-lg"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(100, 180, 255, 0.4), rgba(140, 80, 255, 0.3), rgba(80, 160, 255, 0.4))",
                  filter: "blur(1px)",
                  animation: "hologram-border 4s ease-in-out infinite",
                }}
              />

              {/* Card body */}
              <div
                className="relative rounded-lg px-10 py-10 md:px-14 md:py-12 backdrop-blur-md overflow-hidden"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(15, 20, 50, 0.85) 0%, rgba(10, 12, 35, 0.9) 50%, rgba(15, 15, 45, 0.85) 100%)",
                  border: "1px solid rgba(100, 160, 255, 0.3)",
                  animation: "hologram-glow 4s ease-in-out infinite",
                }}
              >
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: "linear-gradient(90deg, rgba(100, 180, 255, 0.8), transparent)" }} />
                  <div className="absolute top-0 left-0 h-full w-[2px]" style={{ background: "linear-gradient(180deg, rgba(100, 180, 255, 0.8), transparent)" }} />
                </div>
                <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
                  <div className="absolute top-0 right-0 w-full h-[2px]" style={{ background: "linear-gradient(270deg, rgba(140, 100, 255, 0.8), transparent)" }} />
                  <div className="absolute top-0 right-0 h-full w-[2px]" style={{ background: "linear-gradient(180deg, rgba(140, 100, 255, 0.8), transparent)" }} />
                </div>
                <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none">
                  <div className="absolute bottom-0 left-0 w-full h-[2px]" style={{ background: "linear-gradient(90deg, rgba(100, 180, 255, 0.8), transparent)" }} />
                  <div className="absolute bottom-0 left-0 h-full w-[2px]" style={{ background: "linear-gradient(0deg, rgba(100, 180, 255, 0.8), transparent)" }} />
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none">
                  <div className="absolute bottom-0 right-0 w-full h-[2px]" style={{ background: "linear-gradient(270deg, rgba(140, 100, 255, 0.8), transparent)" }} />
                  <div className="absolute bottom-0 right-0 h-full w-[2px]" style={{ background: "linear-gradient(0deg, rgba(140, 100, 255, 0.8), transparent)" }} />
                </div>

                {/* Holographic shimmer overlay */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-lg opacity-[0.03]"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(150, 180, 255, 0.5) 2px, rgba(150, 180, 255, 0.5) 3px)",
                  }}
                />

                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="min-h-[3.5rem] md:min-h-[4.5rem] flex items-center justify-center">
                    <h1 className="text-[clamp(1.6rem,4vw,2.6rem)] font-light tracking-[0.08em] text-white/95 leading-tight">
                      {phase === "text" ? title.displayed : ""}
                      {phase === "text" && !title.isDone && (
                        <span
                          className="inline-block w-[2px] h-[1em] ml-1 align-middle bg-blue-300/80"
                          style={{ animation: "typewriter-cursor 0.8s step-end infinite" }}
                        />
                      )}
                    </h1>
                  </div>

                  <motion.div
                    className="mx-auto mt-4 mb-5 h-[1px] w-32"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(120, 160, 255, 0.5), rgba(160, 120, 255, 0.5), transparent)",
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{
                      scaleX: title.isDone ? 1 : 0,
                      opacity: title.isDone ? 1 : 0,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />

                  <div className="min-h-[2.5rem] flex items-center justify-center">
                    <p className="text-[clamp(0.8rem,1.8vw,1rem)] font-light tracking-wide text-white/50 leading-relaxed max-w-md">
                      {phase === "text" ? description.displayed : ""}
                      {phase === "text" && title.isDone && !description.isDone && (
                        <span
                          className="inline-block w-[2px] h-[0.9em] ml-1 align-middle bg-purple-300/60"
                          style={{ animation: "typewriter-cursor 0.8s step-end infinite" }}
                        />
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Warp flash overlay */}
      <AnimatePresence>
        {warpFlash && (
          <motion.div
            className="absolute inset-0 z-[15] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 1, 0.8] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, times: [0, 0.3, 0.6, 1] }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(150, 180, 255, 0.9) 0%, rgba(100, 120, 255, 0.4) 30%, rgba(0, 0, 0, 0) 65%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Fullscreen character video */}
      <motion.div
        className="absolute inset-0 z-[10]"
        initial={{ opacity: 0, scale: 1.3 }}
        animate={{
          opacity: showCharacter ? 1 : 0,
          scale: showCharacter ? 1 : 1.3,
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <video
          ref={videoRef}
          src="/video.mp4"
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />

        {/* Vignette over video */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0, 0, 0, 0.5) 80%, rgba(0, 0, 0, 0.8) 100%)",
          }}
        />

        {/* Center gradient for card readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 75%, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 40%, transparent 70%)",
          }}
        />

        {/* Identity card overlay centered on video */}
        <motion.div
          className="absolute inset-0 z-[11] flex items-end justify-center pb-12 md:pb-16 px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: showCharacter ? 1 : 0,
            y: showCharacter ? 0 : 30,
          }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <div className="relative w-full max-w-[560px]">
            {/* Outer glow */}
            <div
              className="absolute -inset-[1px] rounded-lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(100, 180, 255, 0.4), rgba(140, 80, 255, 0.3), rgba(80, 160, 255, 0.4))",
                filter: "blur(1px)",
                animation: "hologram-border 4s ease-in-out infinite",
              }}
            />

            {/* Card body */}
            <div
              className="relative rounded-lg px-10 py-8 md:px-14 md:py-10 backdrop-blur-md overflow-hidden"
              style={{
                background:
                  "linear-gradient(160deg, rgba(15, 20, 50, 0.8) 0%, rgba(10, 12, 35, 0.85) 50%, rgba(15, 15, 45, 0.8) 100%)",
                border: "1px solid rgba(100, 160, 255, 0.3)",
                animation: "hologram-glow 4s ease-in-out infinite",
              }}
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: "linear-gradient(90deg, rgba(100, 180, 255, 0.8), transparent)" }} />
                <div className="absolute top-0 left-0 h-full w-[2px]" style={{ background: "linear-gradient(180deg, rgba(100, 180, 255, 0.8), transparent)" }} />
              </div>
              <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-[2px]" style={{ background: "linear-gradient(270deg, rgba(140, 100, 255, 0.8), transparent)" }} />
                <div className="absolute top-0 right-0 h-full w-[2px]" style={{ background: "linear-gradient(180deg, rgba(140, 100, 255, 0.8), transparent)" }} />
              </div>
              <div className="absolute bottom-0 left-0 w-8 h-8 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-full h-[2px]" style={{ background: "linear-gradient(90deg, rgba(100, 180, 255, 0.8), transparent)" }} />
                <div className="absolute bottom-0 left-0 h-full w-[2px]" style={{ background: "linear-gradient(0deg, rgba(100, 180, 255, 0.8), transparent)" }} />
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-full h-[2px]" style={{ background: "linear-gradient(270deg, rgba(140, 100, 255, 0.8), transparent)" }} />
                <div className="absolute bottom-0 right-0 h-full w-[2px]" style={{ background: "linear-gradient(0deg, rgba(140, 100, 255, 0.8), transparent)" }} />
              </div>

              {/* Holographic shimmer */}
              <div
                className="absolute inset-0 pointer-events-none rounded-lg opacity-[0.03]"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(150, 180, 255, 0.5) 2px, rgba(150, 180, 255, 0.5) 3px)",
                }}
              />

              {/* Text content — centered */}
              <div className="relative z-10 text-center">
                <h2
                  className="text-[clamp(1.6rem,4vw,2.6rem)] font-light tracking-[0.08em] text-white/95 leading-tight"
                  style={{
                    textShadow: "0 0 20px rgba(100, 140, 255, 0.3)",
                  }}
                >
                  {titleText}
                </h2>

                <div
                  className="mx-auto mt-4 mb-4 h-[1px] w-32"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(120, 160, 255, 0.5), rgba(160, 120, 255, 0.5), transparent)",
                  }}
                />

                <p
                  className="text-[clamp(0.8rem,1.8vw,1rem)] font-light tracking-wide text-white/50 leading-relaxed max-w-md mx-auto"
                  style={{
                    textShadow: "0 1px 6px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  {descText}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Vignette (for card phase) */}
      <div
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.6) 100%)",
        }}
      />

      {/* Bottom floor glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[30%] pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(to top, rgba(40, 60, 120, 0.06) 0%, transparent 100%)",
        }}
      />
    </motion.div>
  );
}
