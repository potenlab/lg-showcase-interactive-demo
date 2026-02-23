"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WarpCanvas from "./WarpCanvas";

interface WarpEntryProps {
  onComplete?: () => void;
}

export default function WarpEntry({ onComplete }: WarpEntryProps) {
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleStartVoyage = useCallback(() => {
    if (isAccelerating) return;
    setIsAccelerating(true);

    // After 0.6s, trigger exit transition
    setTimeout(() => {
      setIsExiting(true);
    }, 600);

    // Navigate to Screen 2 after exit animation
    setTimeout(() => {
      onComplete?.();
    }, 1200);
  }, [isAccelerating, onComplete]);

  return (
    <motion.div
      className="relative w-screen h-screen overflow-hidden bg-black"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Ambient edge glow */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(30, 60, 150, 0.08) 70%, rgba(20, 40, 120, 0.15) 100%)",
        }}
      />

      {/* Top edge glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[200px] pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(60, 120, 255, 0.06) 0%, transparent 100%)",
        }}
      />

      {/* Bottom edge glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px] pointer-events-none z-[1]"
        style={{
          background:
            "linear-gradient(to top, rgba(60, 80, 200, 0.08) 0%, transparent 100%)",
        }}
      />

      {/* Warp tunnel canvas */}
      <WarpCanvas speed={1.5} accelerating={isAccelerating} />

      {/* Center vortex glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(80, 120, 255, 0.08) 0%, rgba(60, 40, 180, 0.04) 30%, transparent 60%)",
        }}
      />

      {/* Content layer */}
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            className="absolute inset-0 z-[5] flex flex-col items-center justify-between py-16 px-8"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Title */}
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <h1 className="text-[clamp(1.2rem,3vw,1.8rem)] font-light tracking-[0.3em] uppercase text-white/80">
                LG Academy
              </h1>
              <div className="mt-2 h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
              <p className="mt-3 text-[clamp(0.7rem,1.5vw,0.85rem)] tracking-[0.15em] text-blue-300/50 uppercase">
                Interactive Animation Demo
              </p>
            </motion.div>

            {/* Center spacer with subtle text */}
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            >
              <p className="text-[clamp(0.65rem,1.2vw,0.75rem)] tracking-[0.2em] text-white/20 uppercase">
                Prepare for departure
              </p>
            </motion.div>

            {/* Bottom CTA */}
            <motion.div
              className="flex flex-col items-center gap-6 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <button
                onClick={handleStartVoyage}
                disabled={isAccelerating}
                className="group relative cursor-pointer disabled:cursor-not-allowed"
              >
                {/* Button glow ring */}
                <div className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />

                {/* Button border gradient */}
                <div className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-blue-500/60 via-cyan-400/40 to-purple-500/60 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Button inner */}
                <div className="relative px-14 py-5 rounded-full bg-black/80 backdrop-blur-sm border border-white/[0.05]">
                  <span
                    className="text-[clamp(0.8rem,1.5vw,0.95rem)] font-medium tracking-[0.2em] uppercase bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent"
                    style={{
                      backgroundSize: "200% auto",
                      animation: "shimmer 3s linear infinite",
                    }}
                  >
                    Start Voyage
                  </span>
                </div>
              </button>

              {/* Subtle hint */}
              <p
                className="text-[0.65rem] tracking-[0.15em] text-white/15 uppercase"
                style={{ animation: "float 3s ease-in-out infinite" }}
              >
                Click to initiate warp sequence
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Acceleration flash overlay */}
      <AnimatePresence>
        {isAccelerating && (
          <motion.div
            className="absolute inset-0 z-[10] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0.6, 1] }}
            transition={{ duration: 0.8, times: [0, 0.3, 0.6, 1] }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(150, 200, 255, 0.8) 0%, rgba(80, 120, 255, 0.4) 30%, rgba(0, 0, 0, 0) 70%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.4) 100%)",
        }}
      />

      {/* Corner star accents */}
      <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none z-[2] opacity-30">
        <div
          className="absolute top-8 left-8 w-1 h-1 rounded-full bg-blue-300"
          style={{
            boxShadow: "0 0 6px 2px rgba(100, 180, 255, 0.6)",
            animation: "pulse-glow 2s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-16 left-16 w-0.5 h-0.5 rounded-full bg-purple-300"
          style={{
            boxShadow: "0 0 4px 1px rgba(180, 140, 255, 0.4)",
            animation: "pulse-glow 3s ease-in-out infinite 0.5s",
          }}
        />
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none z-[2] opacity-30">
        <div
          className="absolute top-12 right-10 w-1 h-1 rounded-full bg-cyan-300"
          style={{
            boxShadow: "0 0 6px 2px rgba(80, 200, 255, 0.5)",
            animation: "pulse-glow 2.5s ease-in-out infinite 1s",
          }}
        />
      </div>
      <div className="absolute bottom-0 left-0 w-32 h-32 pointer-events-none z-[2] opacity-30">
        <div
          className="absolute bottom-12 left-12 w-0.5 h-0.5 rounded-full bg-blue-200"
          style={{
            boxShadow: "0 0 4px 1px rgba(140, 180, 255, 0.4)",
            animation: "pulse-glow 3.5s ease-in-out infinite 0.3s",
          }}
        />
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none z-[2] opacity-30">
        <div
          className="absolute bottom-10 right-8 w-1 h-1 rounded-full bg-purple-200"
          style={{
            boxShadow: "0 0 5px 2px rgba(160, 140, 255, 0.5)",
            animation: "pulse-glow 2.8s ease-in-out infinite 0.7s",
          }}
        />
      </div>
    </motion.div>
  );
}
