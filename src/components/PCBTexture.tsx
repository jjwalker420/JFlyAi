"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

function calcOpacity(scrollY: number, totalH: number, viewportH: number): number {
  const progress = scrollY / Math.max(totalH - viewportH, 1);
  if (progress <= 0.05) return 0;
  if (progress <= 0.15) return ((progress - 0.05) / 0.10) * 0.13;
  if (progress <= 0.92) return 0.13;
  if (progress <= 1.0)  return ((1.0 - progress) / 0.08) * 0.13;
  return 0;
}

export function PCBTexture() {
  const reduced = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => {
      el.style.opacity = String(
        calcOpacity(window.scrollY, document.body.scrollHeight, window.innerHeight)
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  if (isMobile) return null;

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0,
      }}
    >
      {/* Static base texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/textures/pcb-trace-bg.svg)",
          backgroundRepeat: "repeat",
          backgroundSize: "512px 512px",
        }}
      />

      {/* Spark overlay — gated by prefers-reduced-motion */}
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
  );
}
