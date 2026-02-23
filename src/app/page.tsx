"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";

const WarpEntry = dynamic(() => import("@/components/WarpEntry"), {
  ssr: false,
});

const CockpitScreen = dynamic(() => import("@/components/CockpitScreen"), {
  ssr: false,
});

const IdentityReveal = dynamic(() => import("@/components/IdentityReveal"), {
  ssr: false,
});

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<
    "warp" | "cockpit" | "reveal"
  >("warp");

  return (
    <AnimatePresence mode="wait">
      {currentScreen === "warp" && (
        <WarpEntry
          key="warp"
          onComplete={() => setCurrentScreen("cockpit")}
        />
      )}
      {currentScreen === "cockpit" && (
        <CockpitScreen
          key="cockpit"
          onComplete={() => setCurrentScreen("reveal")}
        />
      )}
      {currentScreen === "reveal" && (
        <IdentityReveal key="reveal" />
      )}
    </AnimatePresence>
  );
}
