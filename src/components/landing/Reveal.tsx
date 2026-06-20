"use client";
// Scroll-reveal wrapper: fades + slides its children in once they enter the
// viewport (IntersectionObserver). Adds the `in` class that globals.css uses to
// drive .reveal and child animations (.barfill). setState happens only inside
// the observer callback (no synchronous set-state-in-effect). A <noscript>
// fallback in the layout reveals everything when JS is disabled.

import { useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.14 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={"reveal " + (shown ? "in " : "") + className}
      style={delay ? { transitionDelay: delay + "s" } : undefined}
    >
      {children}
    </div>
  );
}
