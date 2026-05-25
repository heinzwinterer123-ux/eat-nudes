'use client';

/**
 * ScrollVelocity — Magic UI "scroll-based-velocity" component.
 *
 * Text rows scroll horizontally; scroll speed changes their velocity.
 * Odd-indexed rows run in reverse so the two lines feel dynamic together.
 */

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
  wrap,
} from 'framer-motion';

// ─── Inner row ────────────────────────────────────────────────────────────────

interface VelocityRowProps {
  children: string;
  /** Base pixels/second when the user isn't scrolling */
  baseVelocity?: number;
  /** Number of repetitions in the marquee strip */
  numCopies?: number;
  className?: string;
  separatorClassName?: string;
}

function VelocityRow({
  children,
  baseVelocity = 80,
  numCopies = 8,
  className = '',
  separatorClassName = '',
}: VelocityRowProps) {
  const baseX           = useMotionValue(0);
  const { scrollY }     = useScroll();
  const scrollVelocity  = useVelocity(scrollY);
  const smoothVelocity  = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  // Map scroll velocity → speed multiplier (-2 … +2)
  const velocityFactor  = useTransform(smoothVelocity, [-1200, 1200], [-4, 4], { clamp: false });

  // Wrap baseX into a CSS translate that seamlessly loops
  const x = useTransform(baseX, (v) => `${wrap(-100 / numCopies, 0, v)}%`);

  const directionRef = useRef<1 | -1>(1);

  useAnimationFrame((_t, delta) => {
    let moveBy = directionRef.current * baseVelocity * (delta / 1000);

    // Flip direction based on scroll direction
    if (velocityFactor.get() < 0)      directionRef.current = -1;
    else if (velocityFactor.get() > 0) directionRef.current = 1;

    moveBy += directionRef.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden">
      <motion.div
        className={`flex whitespace-nowrap ${className}`}
        style={{ x }}
      >
        {Array.from({ length: numCopies }).map((_, i) => (
          <span key={i} className="flex items-center gap-0">
            {children}
            <span className={`mx-6 select-none ${separatorClassName}`} aria-hidden>·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

interface ScrollVelocityProps {
  /** Each string becomes one scrolling row; odd rows reverse direction */
  rows: string[];
  baseVelocity?: number;
  numCopies?: number;
  /** Tailwind classes applied to each row's text */
  textClassName?: string;
  separatorClassName?: string;
  className?: string;
}

export function ScrollVelocity({
  rows,
  baseVelocity = 80,
  numCopies = 8,
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
