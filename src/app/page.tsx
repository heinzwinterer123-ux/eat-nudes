'use client';

import { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion';
import MatchaCanvas from '@/components/MatchaCanvas';

// ─── Animation variants ───────────────────────────────────────────────────────

const cardVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.25, 0, 0, 1] as const },
  },
};

const staggerCards = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.13, delayChildren: 0.05 },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [menuOpen, setMenuOpen]         = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [headerDark, setHeaderDark]     = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll: detect mobile-scroll-bg + light-section transition
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setHeaderScrolled(latest > 80);
    // Hero container is h-[400vh]; we enter the light section after 300vh of scroll
    const heroEnd = 3 * (typeof window !== 'undefined' ? window.innerHeight : 900);
    setHeaderDark(latest < heroEnd);
  });

  // Scroll-driven canvas progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // ── Beat keyframe transforms ─────────────────────────────────────────────
  const opacityA = useTransform(smoothProgress, [0, 0.1,  0.1,  0.2 ], [0, 1, 1, 0]);
  const yA       = useTransform(smoothProgress, [0, 0.1,  0.1,  0.2 ], [20, 0, 0, -20]);

  const opacityB = useTransform(smoothProgress, [0.25, 0.35, 0.35, 0.45], [0, 1, 1, 0]);
  const yB       = useTransform(smoothProgress, [0.25, 0.35, 0.35, 0.45], [20, 0, 0, -20]);

  const opacityC = useTransform(smoothProgress, [0.5, 0.6,  0.6,  0.7 ], [0, 1, 1, 0]);
  const yC       = useTransform(smoothProgress, [0.5, 0.6,  0.6,  0.7 ], [20, 0, 0, -20]);

  const opacityD = useTransform(smoothProgress, [0.75, 0.85, 0.85, 0.95], [0, 1, 1, 0]);
  const yD       = useTransform(smoothProgress, [0.75, 0.85, 0.85, 0.95], [20, 0, 0, -20]);

  // ── Header state logic ───────────────────────────────────────────────────
  const isLightSection = !headerDark;

  let headerBg: string;
  if (menuOpen) {
    // Menu open → always dark to match the overlay
    headerBg = 'bg-[#1A1A18]';
  } else if (isLightSection) {
    // Below the hero → light solid header
    headerBg = 'bg-[#F5F2EC] border-b border-[#E2DDD5]';
  } else if (headerScrolled) {
    // Scrolled within dark hero → blur on mobile only
    headerBg =
      'bg-black/80 backdrop-blur-md border-b border-white/10 ' +
      'md:bg-transparent md:backdrop-blur-none md:border-transparent';
  } else {
    // Very top of dark hero → difference blend so logo always shows
    headerBg = 'mix-blend-difference bg-transparent';
  }

  const logoInvert     = menuOpen || !isLightSection; // white logo on dark bg
  const navColor       = isLightSection && !menuOpen ? 'text-[#1A1A18]' : 'text-white';
  const burgerColor    = isLightSection && !menuOpen ? 'text-[#1A1A18]' : 'text-white';

  return (
    <main className="bg-black text-[#1A1A18] font-sans selection:bg-black/10">

      {/* ── Loading screen ───────────────────────────────────────────── */}
      {loadProgress < 100 && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <div className="text-white/40 text-[10px] mb-5 tracking-[0.35em] uppercase font-mono">
            Loading Experience
          </div>
          <div className="w-48 h-px bg-white/20 relative">
            <div
              className="absolute left-0 top-0 h-full bg-white transition-all duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <div className="text-white/30 mt-4 font-mono text-[10px] tracking-widest">
            {loadProgress}%
          </div>
        </div>
      )}

      {/* ── Mobile full-screen menu overlay ─────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-[#1A1A18] flex flex-col items-center justify-center md:hidden"
          >
            <nav className="flex flex-col items-center gap-11">
              {[
                { label: 'Menu',      href: '#' },
                { label: 'Our Story', href: '#' },
                { label: 'Locations', href: '#' },
              ].map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.07 * i, ease: [0.25, 0, 0, 1] }}
                  className="text-3xl font-bold tracking-[0.15em] uppercase text-white hover:opacity-50 transition-opacity"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="absolute bottom-10 text-white/25 text-[10px] font-mono tracking-[0.3em] uppercase"
            >
              BARCELONA · MADRID
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fixed header ─────────────────────────────────────────────── */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          flex items-center justify-between
          pointer-events-none
          px-5 py-4 md:px-10 md:py-5
          transition-all duration-500
          ${headerBg}
          ${loadProgress === 100 ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {/* Logo */}
        <a href="/" aria-label="Back to top" className="pointer-events-auto">
          <img
            src="/logo.png"
            alt="EAT.NUDES"
            className={`h-7 md:h-8 object-contain transition-all duration-500 ${logoInvert ? 'invert' : ''}`}
          />
        </a>

        {/* Desktop nav */}
        <nav
          className={`
            hidden md:flex items-center gap-9
            text-[11px] font-mono tracking-[0.22em] uppercase
            pointer-events-auto transition-colors duration-500
            ${navColor}
          `}
        >
          <a href="#" className="hover:opacity-50 transition-opacity">Menu</a>
          <a href="#" className="hover:opacity-50 transition-opacity">Our Story</a>
          <a href="#" className="hover:opacity-50 transition-opacity">Find Us</a>
        </nav>

        {/* Mobile hamburger / close */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className={`md:hidden pointer-events-auto p-1 -mr-1 transition-colors duration-500 ${burgerColor}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="7"  x2="20" y2="7"  />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>
      </header>

      {/* ── Hero — always dark, canvas-driven ───────────────────────── */}
      <div
        ref={containerRef}
        className={`relative w-full h-[400vh] transition-opacity duration-1000 ${
          loadProgress === 100 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <MatchaCanvas onLoadProgress={setLoadProgress} smoothProgress={smoothProgress} />

          <div className="absolute inset-0 pointer-events-none flex flex-col justify-center">

            {/* Beat A */}
            <motion.div
              style={{ opacity: opacityA, y: yA }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-16"
            >
              <h1 className="text-[clamp(2rem,8vw,6rem)] font-bold tracking-tight text-white/90 mb-4 md:mb-6">
                NOTHING TO HIDE.
              </h1>
              <p className="text-base sm:text-lg md:text-2xl text-white/60 max-w-2xl font-light">
                Born in El Born. Obsessed with real food, good vibes, and zero nonsense.
              </p>
            </motion.div>

            {/* Beat B */}
            <motion.div
              style={{ opacity: opacityB, y: yB }}
              className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-16"
            >
              <h2 className="text-[clamp(1.75rem,7vw,5rem)] font-bold tracking-tight text-white/90 mb-4 md:mb-6">
                STRIPPED CLEAN.
              </h2>
              <p className="text-base sm:text-lg md:text-2xl text-white/60 max-w-xl font-light">
                No shortcuts. No fillers. Every ingredient earns its place — or it's out.
              </p>
            </motion.div>

            {/* Beat C */}
            <motion.div
              style={{ opacity: opacityC, y: yC }}
              className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 md:px-16"
            >
              <h2 className="text-[clamp(1.75rem,7vw,5rem)] font-bold tracking-tight text-white/90 mb-4 md:mb-6">
                THE GOOD STUFF.
              </h2>
              <p className="text-base sm:text-lg md:text-2xl text-white/60 max-w-xl font-light">
                Ceremonial matcha. Açaí soft serve. Rolls so fresh, you'll skip dinner.
              </p>
            </motion.div>

            {/* Beat D */}
            <motion.div
              style={{ opacity: opacityD, y: yD }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-16"
            >
              <h2 className="text-[clamp(2.5rem,10vw,6.5rem)] font-black tracking-tighter text-white mb-4 md:mb-6">
                EAT.NUDES
              </h2>
              <p className="text-base sm:text-lg md:text-2xl text-white/60 max-w-2xl font-light mb-8 md:mb-12">
                Barcelona and Madrid's favourite stripped-back health bar. Come as you are.
              </p>
              <button className="px-7 py-3 md:px-8 md:py-4 bg-white text-black font-semibold tracking-wide uppercase text-sm hover:bg-white/90 transition-colors rounded-full pointer-events-auto">
                See the Menu
              </button>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── Light-theme content ──────────────────────────────────────── */}
      <div
        className={`relative z-10 bg-[#F5F2EC] transition-opacity duration-1000 ${
          loadProgress === 100 ? 'opacity-100' : 'opacity-0'
        }`}
      >

        {/* — Ingredients / Craftsmanship — */}
        <section className="py-24 md:py-40 px-6 md:px-24 border-t border-[#E2DDD5]">
          <div className="max-w-5xl mx-auto">

            <motion.h3
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: [0.25, 0, 0, 1] as const }}
              className="text-2xl sm:text-3xl md:text-5xl font-light text-[#1A1A18] mb-14 md:mb-20 max-w-xl leading-tight"
            >
              Clean.<br />Fresh.<br />Obsessive.
            </motion.h3>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={staggerCards}
            >
              {[
                {
                  title: 'No Filler. Ever.',
                  body:  "Artificial colours, flavours, preservatives — none of them made the cut. If we can't say it out loud, it's not going in.",
                },
                {
                  title: 'Made Every Morning',
                  body:  "Rolls wrapped, bowls built, smoothies blended fresh daily. Because day-old health food isn't health food.",
                },
                {
                  title: 'Your Way',
                  body:  'Vegan, gluten-free, high-protein — you set the rules. We make sure you leave satisfied, whatever that looks like for you.',
                },
              ].map((card) => (
                <motion.div key={card.title} variants={cardVariant}>
                  <div className="h-px w-10 bg-[#1A1A18]/20 mb-7" />
                  <h4 className="text-base font-bold text-[#1A1A18] mb-3 tracking-wide">{card.title}</h4>
                  <p className="text-[#6B6760] font-light leading-relaxed text-[15px]">{card.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* — CTA Banner — */}
        <section className="py-28 md:py-56 px-6 md:px-24 border-t border-[#E2DDD5] relative overflow-hidden flex flex-col items-center text-center">

          {/* Wordmark as a ghosted watermark behind the text.
              mix-blend-mode:screen makes the black bg invisible,
              leaving only the white NUDES text as a faint ghost. */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
               style={{ mixBlendMode: 'screen' }}>
            <img
              src="/logo-wordmark.png"
              alt=""
              aria-hidden="true"
              className="w-[175%] max-w-none opacity-[0.12] object-contain"
            />
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 55 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.25, 0, 0, 1] as const }}
            className="text-[clamp(2.25rem,8vw,6rem)] font-black tracking-tighter text-[#1A1A18] mb-6 md:mb-8 max-w-5xl relative z-10"
          >
            FEED YOUR REAL SELF.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0, 0, 1] as const }}
            className="text-base sm:text-lg md:text-xl text-[#6B6760] font-light mb-10 md:mb-14 max-w-2xl relative z-10"
          >
            Carrer del Rec 10, El Born, Barcelona · C/ San Mateo 30, Alonso Martínez, Madrid.
            <br className="hidden md:block" /> Open daily, no reservations required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.28, ease: [0.25, 0, 0, 1] as const }}
            className="relative z-10"
          >
            <button className="px-9 py-4 md:px-12 md:py-5 bg-[#1A1A18] text-white font-semibold tracking-[0.12em] uppercase text-[13px] hover:opacity-70 hover:scale-[1.03] transition-all duration-300 rounded-full">
              Find a Location
            </button>
          </motion.div>
        </section>

        {/* — Footer — dark for a strong brand close — */}
        <footer className="bg-[#1A1A18] py-16 md:py-24 px-6 md:px-24 flex flex-col items-center">

          {/* Large secondary wordmark */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: [0.25, 0, 0, 1] as const }}
            className="mb-10 md:mb-14"
          >
            {/* screen blend removes the black jpeg bg, only the white text shows */}
            <img
              src="/logo-wordmark.png"
              alt="NUDES™"
              className="h-12 md:h-[4.5rem] object-contain opacity-90"
              style={{ mixBlendMode: 'screen' }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6 md:gap-12 text-[11px] text-white/40 font-mono uppercase tracking-[0.2em] mb-10 md:mb-14"
          >
            <a href="#" className="hover:text-white transition-colors">Menu</a>
            <a href="#" className="hover:text-white transition-colors">Our Story</a>
            <a href="#" className="hover:text-white transition-colors">Locations</a>
            <a href="https://www.instagram.com/eat.nudes/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Order Online</a>
          </motion.div>

          <div className="flex flex-col items-center gap-2 text-[10px] text-white/20 font-mono tracking-[0.1em] text-center">
            <span>CARRER DEL REC 10, EL BORN, BARCELONA · C/ SAN MATEO 30, ALONSO MARTÍNEZ, MADRID</span>
            <span>© {new Date().getFullYear()} NUDES™. ALL RIGHTS RESERVED.</span>
          </div>
        </footer>

      </div>
    </main>
  );
}
