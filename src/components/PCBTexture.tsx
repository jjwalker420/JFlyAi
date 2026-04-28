"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function PCBTexture() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Invisible in hero (0) → ramps in at first content section → holds through middle → fades at CTA
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.15, 0.85, 0.95, 1],
    [0, 0, 0.12, 0.12, 0, 0]
  );

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity,
      }}
    >
      {/* Static base texture — always present on desktop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/textures/pcb-trace-bg.svg)",
          backgroundRepeat: "repeat",
          backgroundSize: "512px 512px",
        }}
      />

      {/* Spark overlay — pulsing opacity animation, gated by prefers-reduced-motion */}
      {!reduced && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/textures/pcb-spark-overlay.svg)",
            backgroundRepeat: "repeat",
            backgroundSize: "512px 512px",
            mixBlendMode: "screen",
            animation: "pcb-spark-pulse 7s ease-in-out infinite alternate",
          }}
        />
      )}
    </motion.div>
  );
}
