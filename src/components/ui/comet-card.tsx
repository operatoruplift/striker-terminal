"use client";
// CometCard: interactive 3D collectible wrapper (Aceternity CometCard API,
// ported dependency-free). Tracks the cursor to rotate the card on X/Y, adds a
// translate depth drift, scales up on hover, and drives a cursor-following
// glare - all via CSS variables + transitions (no motion library), matching
// the terminal's zero-dependency animation approach. Reduced-motion safe.

import { useCallback, useRef } from "react";

interface CometCardProps {
  /** Max tilt in degrees at the card edges. */
  rotateDepth?: number;
  /** Max parallax translation in px at the card edges. */
  translateDepth?: number;
  className?: string;
  children: React.ReactNode;
}

export function CometCard({
  rotateDepth = 17.5,
  translateDepth = 20,
  className = "",
  children,
}: CometCardProps) {
  const tiltRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = tiltRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--cc-rx", yPct * 2 * -rotateDepth + "deg");
      el.style.setProperty("--cc-ry", xPct * 2 * rotateDepth + "deg");
      el.style.setProperty("--cc-tx", xPct * 2 * translateDepth + "px");
      el.style.setProperty("--cc-ty", yPct * 2 * translateDepth + "px");
      el.style.setProperty("--cc-gx", (xPct + 0.5) * 100 + "%");
      el.style.setProperty("--cc-gy", (yPct + 0.5) * 100 + "%");
      el.style.setProperty("--cc-glare", "0.5");
    },
    [rotateDepth, translateDepth],
  );

  const handleMouseLeave = useCallback(() => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty("--cc-rx", "0deg");
    el.style.setProperty("--cc-ry", "0deg");
    el.style.setProperty("--cc-tx", "0px");
    el.style.setProperty("--cc-ty", "0px");
    el.style.setProperty("--cc-glare", "0");
  }, []);

  return (
    <div className={className} style={{ perspective: "1200px" }}>
      <div
        ref={tiltRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="comet-tilt relative rounded-[16px]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
        <div className="comet-glare pointer-events-none absolute inset-0 rounded-[16px] mix-blend-overlay" aria-hidden="true"></div>
      </div>
    </div>
  );
}
