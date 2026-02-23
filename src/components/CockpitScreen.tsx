"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CockpitScreenProps {
  onComplete?: () => void;
}

export default function CockpitScreen({ onComplete }: CockpitScreenProps) {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const theme = useMemo(
    () =>
      isActivated
        ? {
            primary: "rgba(168, 85, 247, 0.8)",
            primaryLight: "rgba(192, 132, 252, 0.6)",
            glow: "rgba(168, 85, 247, 0.3)",
            glowStrong: "rgba(168, 85, 247, 0.5)",
            border: "rgba(168, 85, 247, 0.4)",
            text: "rgb(216, 180, 254)",
            bg: "rgba(168, 85, 247, 0.05)",
          }
        : {
            primary: "rgba(0, 200, 255, 0.8)",
            primaryLight: "rgba(0, 200, 255, 0.6)",
            glow: "rgba(0, 200, 255, 0.3)",
            glowStrong: "rgba(0, 200, 255, 0.5)",
            border: "rgba(0, 200, 255, 0.4)",
            text: "rgb(165, 230, 255)",
            bg: "rgba(0, 200, 255, 0.05)",
          },
    [isActivated]
  );

  const handleAnalyze = useCallback(() => {
    if (!inputText.trim() || isAnalyzing) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setIsActivated(true);
    }, 1000);
  }, [inputText, isAnalyzing]);

  // Engine ring SVG values
  const circumference = 2 * Math.PI * 52;
  const engineOffset = isActivated ? 0 : circumference;

  return (
    <motion.div
      className="relative w-screen h-screen overflow-hidden bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Circuit board pattern background */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-[0]"
        style={{ opacity: 0.04 }}
      >
        <defs>
          <pattern
            id="circuit"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 40h20M40 0v20M60 40h20M40 60v20"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
            />
            <circle cx="40" cy="40" r="2" fill="currentColor" />
            <circle cx="20" cy="40" r="1.5" fill="currentColor" />
            <circle cx="60" cy="40" r="1.5" fill="currentColor" />
            <circle cx="40" cy="20" r="1.5" fill="currentColor" />
            <circle cx="40" cy="60" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>

      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${theme.bg} 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, ${theme.bg} 0%, transparent 60%)`,
          transition: "all 1.5s ease",
        }}
      />

      {/* Main content */}
      <div className="relative z-[5] w-full h-full flex flex-col md:flex-row items-stretch p-6 md:p-10 gap-6 md:gap-8">
        {/* LEFT PANEL — Input Area */}
        <motion.div
          className="flex-[3] flex flex-col min-w-0"
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <div
            className="relative flex-1 flex flex-col rounded-sm overflow-hidden"
            style={{
              border: `1px solid ${theme.border}`,
              boxShadow: `0 0 12px ${theme.glow}, inset 0 0 12px ${theme.bg}`,
              animation: "hud-pulse 3s ease-in-out infinite",
              transition: "border-color 1.5s ease, box-shadow 1.5s ease",
            }}
          >
            {/* Corner brackets */}
            {/* Top-left */}
            <div
              className="absolute top-0 left-0 w-5 h-5 pointer-events-none"
              style={{
                borderTop: `2px solid ${theme.primary}`,
                borderLeft: `2px solid ${theme.primary}`,
                transition: "border-color 1.5s ease",
              }}
            />
            {/* Top-right */}
            <div
              className="absolute top-0 right-0 w-5 h-5 pointer-events-none"
              style={{
                borderTop: `2px solid ${theme.primary}`,
                borderRight: `2px solid ${theme.primary}`,
                transition: "border-color 1.5s ease",
              }}
            />
            {/* Bottom-left */}
            <div
              className="absolute bottom-0 left-0 w-5 h-5 pointer-events-none"
              style={{
                borderBottom: `2px solid ${theme.primary}`,
                borderLeft: `2px solid ${theme.primary}`,
                transition: "border-color 1.5s ease",
              }}
            />
            {/* Bottom-right */}
            <div
              className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none"
              style={{
                borderBottom: `2px solid ${theme.primary}`,
                borderRight: `2px solid ${theme.primary}`,
                transition: "border-color 1.5s ease",
              }}
            />

            {/* Panel header */}
            <div
              className="px-5 py-3 flex items-center gap-3"
              style={{
                borderBottom: `1px solid ${theme.border}`,
                transition: "border-color 1.5s ease",
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: theme.primary,
                  boxShadow: `0 0 6px ${theme.glow}`,
                  transition: "all 1.5s ease",
                }}
              />
              <span
                className="text-xs font-mono tracking-[0.15em] uppercase"
                style={{ color: theme.text, transition: "color 1.5s ease" }}
              >
                System Input Terminal
              </span>
            </div>

            {/* Textarea area */}
            <div className="relative flex-1 p-5">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter system parameters for analysis..."
                disabled={isAnalyzing}
                className="w-full h-full bg-transparent resize-none outline-none font-mono text-sm leading-relaxed placeholder:text-white/20 disabled:opacity-50"
                style={{
                  color: theme.text,
                  transition: "color 1.5s ease",
                  caretColor: theme.primary,
                }}
              />

              {/* Scan line overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div
                    className="absolute left-0 right-0 h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${theme.primaryLight}, transparent)`,
                      animation: "scan-line 1s linear",
                      transition: "background 1.5s ease",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Bottom bar with button */}
            <div
              className="px-5 py-3 flex items-center justify-between"
              style={{
                borderTop: `1px solid ${theme.border}`,
                transition: "border-color 1.5s ease",
              }}
            >
              <span
                className="text-[0.65rem] font-mono tracking-wider uppercase"
                style={{
                  color: isAnalyzing
                    ? "rgba(250, 204, 21, 0.7)"
                    : `${theme.text}80`,
                  transition: "color 1.5s ease",
                }}
              >
                {isAnalyzing
                  ? "Scanning..."
                  : isActivated
                    ? "Analysis Complete"
                    : "Ready"}
              </span>

              <button
                onClick={handleAnalyze}
                disabled={!inputText.trim() || isAnalyzing}
                className="relative cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 group"
              >
                <div
                  className="px-8 py-3.5 rounded-sm font-mono text-xs tracking-[0.15em] uppercase"
                  style={{
                    border: `1px solid ${theme.border}`,
                    color: theme.text,
                    backgroundColor: theme.bg,
                    boxShadow: `0 0 8px ${theme.glow}`,
                    transition: "all 1.5s ease",
                  }}
                >
                  Analyze System
                </div>
              </button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT PANEL — Status Dashboard */}
        <motion.div
          className="flex-[2] flex flex-col gap-5 min-w-0"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
        >
          {/* Engine Ring */}
          <div
            className="flex-1 flex flex-col items-center justify-center rounded-sm p-6"
            style={{
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.bg,
              transition: "all 1.5s ease",
            }}
          >
            <span
              className="text-[0.6rem] font-mono tracking-[0.2em] uppercase mb-4"
              style={{ color: `${theme.text}99`, transition: "color 1.5s ease" }}
            >
              Engine Status
            </span>

            <div className="relative w-[130px] h-[130px]">
              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 120 120"
                style={{
                  animation: isActivated
                    ? "ring-glow 2s ease-in-out infinite"
                    : "none",
                }}
              >
                {/* Background ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  strokeWidth="4"
                  stroke="rgba(255,255,255,0.08)"
                />
                {/* Animated ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke={isActivated ? theme.primary : "rgba(255,255,255,0.15)"}
                  strokeDasharray={circumference}
                  strokeDashoffset={engineOffset}
                  style={{
                    transition:
                      "stroke-dashoffset 1.5s ease, stroke 1.5s ease",
                  }}
                />
              </svg>
              {/* Center label */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="text-xs font-mono tracking-[0.15em] uppercase"
                  style={{
                    color: isActivated ? theme.text : "rgba(255,255,255,0.3)",
                    transition: "color 1.5s ease",
                  }}
                >
                  {isActivated ? "Online" : "Offline"}
                </span>
              </div>
            </div>
          </div>

          {/* Fuel Gauge */}
          <div
            className="rounded-sm p-5"
            style={{
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.bg,
              transition: "all 1.5s ease",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-[0.6rem] font-mono tracking-[0.2em] uppercase"
                style={{
                  color: `${theme.text}99`,
                  transition: "color 1.5s ease",
                }}
              >
                Fuel Level
              </span>
              <span
                className="text-xs font-mono"
                style={{ color: theme.text, transition: "color 1.5s ease" }}
              >
                {isActivated ? "100%" : "0%"}
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${theme.primary}, ${theme.primaryLight})`,
                  boxShadow: `0 0 10px ${theme.glow}`,
                  transition: "background 1.5s ease, box-shadow 1.5s ease",
                }}
                initial={{ width: "0%" }}
                animate={{ width: isActivated ? "100%" : "0%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Status Badge */}
          <div
            className="rounded-sm p-5 flex items-center gap-4"
            style={{
              border: `1px solid ${theme.border}`,
              backgroundColor: theme.bg,
              transition: "all 1.5s ease",
            }}
          >
            {/* Status dot */}
            <div className="relative flex-shrink-0">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: isActivated
                    ? "rgb(74, 222, 128)"
                    : "rgba(250, 204, 21, 0.6)",
                  boxShadow: isActivated
                    ? "0 0 8px rgba(74, 222, 128, 0.5)"
                    : "0 0 6px rgba(250, 204, 21, 0.3)",
                  transition: "all 1.5s ease",
                }}
              />
              {isActivated && (
                <div
                  className="absolute inset-0 w-3 h-3 rounded-full animate-ping"
                  style={{ backgroundColor: "rgba(74, 222, 128, 0.4)" }}
                />
              )}
            </div>

            <div className="flex flex-col gap-0.5">
              <span
                className="text-xs font-mono tracking-[0.1em] uppercase font-medium"
                style={{ color: theme.text, transition: "color 1.5s ease" }}
              >
                {isActivated ? "Active" : "Standby"}
              </span>
              <span
                className="text-[0.6rem] font-mono tracking-wider"
                style={{
                  color: `${theme.text}80`,
                  transition: "color 1.5s ease",
                }}
              >
                {isActivated ? "System Online" : "Awaiting Input"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Continue button — appears after activation */}
      <AnimatePresence>
        {isActivated && (
          <motion.div
            className="absolute bottom-8 left-0 right-0 z-[10] flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
          >
            <button
              onClick={() => onComplete?.()}
              className="group relative cursor-pointer"
            >
              <div
                className="absolute -inset-[1px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(168, 85, 247, 0.5), rgba(120, 80, 255, 0.5), rgba(168, 85, 247, 0.5))",
                }}
              />
              <div className="relative px-12 py-4.5 rounded-full bg-black/80 backdrop-blur-sm border border-white/[0.05]">
                <span
                  className="text-sm font-mono tracking-[0.15em] uppercase"
                  style={{
                    animation: "shimmer 3s linear infinite",
                    background:
                      "linear-gradient(90deg, rgb(216, 180, 254), rgb(255, 255, 255), rgb(216, 180, 254))",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Generate Identity
                </span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.5) 100%)",
        }}
      />
    </motion.div>
  );
}
