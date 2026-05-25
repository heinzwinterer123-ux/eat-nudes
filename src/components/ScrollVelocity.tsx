'use client';

/**
 * ScrollVelocity — pixel-accurate scroll-based marquee.
 *
 * Why not wrap() + percentages (previous approach):
 *   wrap(-100/n, 0, v)% works going right, but for leftward rows the
 *   wrap boundary fires in the wrong direction and snaps the strip
 *   to a different visual position → the "glitch / stops in middle" bug.
 *
 * Fix: measure the rendered width of one copy in pixels, then use simple
 * modulo arithmetic on a totalDistance counter that only ever increases.
 * No direction flipping, no wrap function, no percentage translations.
 *
 *   leftward:  x = -(totalDist % copyWidth)         → 0 → -copyWidth → 0 …
 *   rightward: x =  (totalDist % copyWidth) - copyWidth → -copyWidth → 0 → -copyWidth …
 *
 * Both loops are seamless because adjacent copies are identical.
 */

import { useEffect, useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from 'framer-motion';

// ─── Single row ───────────────────────────────────────────────────────────────

interface VelocityRowProps {
  children: string;
  /** px/s base drift. Positive = leftward, negative = rightward. */
  baseVelocity?: number;
  numCopies?: number;
  className?: string;
  separatorClassName?: string;
}

function VelocityRow({
  children,
  baseVelocity = 10,
  numCopies = 10,
  className = '',
  separatorClassName = '',
}: VelocityRowProps) {
  const x          = useMotionValue(0);
  const copyRef    = useRef<HTMLSpanElement>(null);
  const copyWidth  = useRef(0);   // measured px width of one copy
  const totalDist  = useRef(0);   // always-increasing distance counter

  // Measure one copy's pixel width after mount / on resize
  useEffect(() => {
    const measure = () => {
      if (copyRef.current) copyWidth.current = copyRef.current.offsetWidth;
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Scroll velocity → speed boost
  const { scrollY }    = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 80, stiffness: 150 });
  // Always positive [0, 4]: any scroll direction speeds things up
  const velocityFactor = useTransform(smoothVelocity, [-500, 500], [0, 4], { clamp: true });

  const isLeftward = baseVelocity >= 0;
  const absV       = Math.abs(baseVelocity);

  useAnimationFrame((_t, delta) => {
    const cw = copyWidth.current;
    if (!cw) return;

    const boost = 1 + velocityFactor.get();           // 1× … 3×
    // Keep totalDist in [0, cw) to avoid float precision drift
    totalDist.current = (totalDist.current + absV * boost * (delta / 1000)) % cw;

    const pos = totalDist.current;
    // Leftward:  starts at 0, moves to -cw, seamlessly jumps back to 0
    // Rightward: starts at -cw, moves to 0, seamlessly jumps back to -cw
    x.set(isLeftward ? -pos : pos - cw);
  });

  return (
    <div className="overflow-hidden">
      <motion.div
        className={`flex whitespace-nowrap ${className}`}
        style={{ x, willChange: 'transform' }}
      >
        {Array.from({ length: numCopies }).map((_, i) => (
          <span
            key={i}
            ref={i === 0 ? copyRef : null}
            className="flex items-center"
          >
            {children}
            <span className={`mx-8 select-none ${separatorClassName}`} aria-hidden>
              ·
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

interface ScrollVelocityProps {
  rows: string[];
  baseVelocity?: number;
  numCopies?: number;
  textClassName?: string;
  separatorClassName?: string;
  className?: string;
}

export function ScrollVelocity({
  rows,
  baseVelocity = 10,
  numCopies = 10,
  textClassName = '',
  separatorClassName = '',
  className = '',
}: ScrollVelocityProps) {
  return (
    <div className={className}>
      {rows.map((row, i) => (
        <VelocityRow
          key={i}
          baseVelocity={i % 2 === 0 ? baseVelocity : -baseVelocity}
          numCopies={numCopies}
          className={textClassName}
          separatorClassName={separatorClassName}
        >
          {row}
        </VelocityRow>
      ))}
    </div>
  );
}
