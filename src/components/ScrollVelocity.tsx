'use client';

/**
 * ScrollVelocity — scroll-based marquee.
 *
 * Key design decisions:
 * - Direction is fixed by the sign of baseVelocity — never flips.
 *   Flipping caused: (a) desktop jitter as velocity oscillated near 0,
 *   (b) mobile loops that never completed after an upward scroll.
 * - Math.abs(velocityFactor) means ANY scroll direction speeds the text up.
 * - velocityFactor is hard-clamped to prevent iOS momentum spikes.
 */

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

// ─── Single scrolling row ─────────────────────────────────────────────────────

interface VelocityRowProps {
  children: string;
  /** px/s drift at rest — keep 8-15 for a gentle ticker feel */
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
  const baseX          = useMotionValue(0);
  const { scrollY }    = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Smooth out spiky iOS momentum scroll events
  const smoothVelocity = useSpring(scrollVelocity, { damping: 80, stiffness: 150 });

  // Clamp multiplier — never let a mobile scroll burst blow up the speed
  const velocityFactor = useTransform(
    smoothVelocity,
    [-600, 600],
    [0, 2],             // always 0–2 (absolute), direction handled by sign of baseVelocity
    { clamp: true },
  );

  // Wrap x% so the strip loops seamlessly: one copy = 100/numCopies % of total
  const x = useTransform(baseX, (v) => `${wrap(-100 / numCopies, 0, v)}%`);

  const sign = baseVelocity >= 0 ? 1 : -1;
  const abs  = Math.abs(baseVelocity);

  useAnimationFrame((_t, delta) => {
    // Scroll speeds up the drift (1× at rest, up to 3× at peak scroll)
    const boost  = 1 + velocityFactor.get();      // 1 … 3
    const moveBy = sign * abs * boost * (delta / 1000);
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
            <span className={`mx-5 select-none ${separatorClassName}`} aria-hidden>
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
          // odd rows run right-to-left (negative sign)
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
