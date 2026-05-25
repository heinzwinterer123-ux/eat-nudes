'use client';

/**
 * ScrollVelocity — Magic UI "scroll-based-velocity" component.
 *
 * Text rows drift slowly at rest and speed up proportionally to scroll velocity.
 * Odd rows run in reverse.
 *
 * Mobile fix: velocityFactor is hard-clamped so iOS momentum spikes can't
 * send the strip flying; spring damping is high to kill oscillation.
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
  /** Pixels per second at rest — keep low (12–25) for a gentle drift */
  baseVelocity?: number;
  numCopies?: number;
  className?: string;
  separatorClassName?: string;
}

function VelocityRow({
  children,
  baseVelocity = 15,
  numCopies = 8,
  className = '',
  separatorClassName = '',
}: VelocityRowProps) {
  const baseX          = useMotionValue(0);
  const { scrollY }    = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // High damping + low stiffness → absorbs iOS momentum spikes smoothly
  const smoothVelocity = useSpring(scrollVelocity, { damping: 80, stiffness: 200 });

  // Clamp multiplier to ±2 so mobile scroll bursts stay readable
  const velocityFactor = useTransform(
    smoothVelocity,
    [-800, 800],
    [-2, 2],
    { clamp: true },          // ← hard cap; prevents mobile spike glitches
  );

  // Wrap baseX % seamlessly: one copy = 100/numCopies % of total width
  const x = useTransform(baseX, (v) => `${wrap(-100 / numCopies, 0, v)}%`);

  const directionRef = useRef<1 | -1>(1);

  useAnimationFrame((_t, delta) => {
    // Base drift: e.g. 15 px/s → 0.25 px at 60 fps — barely perceptible
    let moveBy = directionRef.current * baseVelocity * (delta / 1000);

    // Flip direction on scroll direction change
    if      (velocityFactor.get() < 0) directionRef.current = -1;
    else if (velocityFactor.get() > 0) directionRef.current = 1;

    // Add scroll boost (clamped, so max total is baseVelocity × 3)
    moveBy += directionRef.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden">
      <motion.div
        className={`flex whitespace-nowrap ${className}`}
        style={{ x, willChange: 'transform' }}
      >
        {Array.from({ length: numCopies }).map((_, i) => (
          <span key={i} className="flex items-center">
            {children}
            <span className={`mx-5 select-none ${separatorClassName}`} aria-hidden>·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

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
  baseVelocity = 15,
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
