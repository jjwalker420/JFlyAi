"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Scroll progress 0–1 across the active band; 0 in hero (≤5%) and tail (>1.0)
function calcProgress(scrollY: number, totalH: number, viewportH: number): number {
  const p = scrollY / Math.max(totalH - viewportH, 1);
  if (p <= 0.05) return 0;
  if (p <= 0.15) return (p - 0.05) / 0.10;
  if (p <= 0.92) return 1;
  if (p <= 1.0) return (1.0 - p) / 0.08;
  return 0;
}

const TRACE_MAX = 0.08;   // PCB pattern ceiling — ambient, not foreground
const WASH_MAX = 0.7;     // wash wrapper × bg-color 0.05 ≈ 3.5% effective warm lift

export function PCBTexture() {
  const reduced = useReducedMotion();
  const washRef = useRef<HTMLDivElement>(null);
  const tracesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const p = calcProgress(window.scrollY, document.body.scrollHeight, window.innerHeight);
      if (washRef.current) washRef.current.style.opacity = String(p * WASH_MAX);
      if (tracesRef.current) tracesRef.current.style.opacity = String(p * TRACE_MAX);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      {/* Layer 1 — warm-amber wash that lifts dark section backgrounds */}
      <div
        ref={washRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0,
          backgroundColor: "rgba(217, 147, 58, 0.05)",
        }}
      />

      {/* Layer 2 — PCB trace pattern */}
      <div
        ref={tracesRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url(/textures/pcb-trace-bg.svg)",
            backgroundRepeat: "repeat",
            backgroundSize: "512px 512px",
          }}
        />
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
      </div>
    </>
  );
}
