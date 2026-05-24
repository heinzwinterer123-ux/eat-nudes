'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValueEvent } from 'framer-motion';
import MatchaCanvas from '@/components/MatchaCanvas';

export default function Home() {
  const [loadProgress, setLoadProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track window scroll to show mobile header background
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setHeaderScrolled(latest > 80);
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Beat A: 0 - 20%
  const opacityA = useTransform(smoothProgress, [0, 0.1, 0.1, 0.2], [0, 1, 1, 0]);
  const yA = useTransform(smoothProgress, [0, 0.1, 0.1, 0.2], [20, 0, 0, -20]);

  // Beat B: 25% - 45%
  const opacityB = useTransform(smoothProgress, [0.25, 0.35, 0.35, 0.45], [0, 1, 1, 0]);
  const yB = useTransform(smoothProgress, [0.25, 0.35, 0.35, 0.45], [20, 0, 0, -20]);

  // Beat C: 50% - 70%
  const opacityC = useTransform(smoothProgress, [0.5, 0.6, 0.6, 0.7], [0, 1, 1, 0]);
  const yC = useTransform(smoothProgress, [0.5, 0.6, 0.6, 0.7], [20, 0, 0, -20]);

  // Beat D: 75% - 95%
  const opacityD = useTransform(smoothProgress, [0.75, 0.85, 0.85, 0.95], [0, 1, 1, 0]);
  const yD = useTransform(smoothProgress, [0.75, 0.85, 0.85, 0.95], [20, 0, 0, -20]);

  return (
    <main className="bg-black text-white font-sans selection:bg-white/30">
      {/* Loading Screen */}
      {loadProgress < 100 && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
          <div className="text-white/60 text-sm mb-4 tracking-widest uppercase font-mono">
            Loading Experience
          </div>
          <div className="w-64 h-[1px] bg-white/20 relative">
            <div 
              className="absolute left-0 top-0 h-full bg-white transition-all duration-300 ease-out" 
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <div className="text-white mt-4 font-mono text-xs">
            {loadProgress}%
          </div>
        </div>
      )}

      {/* Mobile full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center md:hidden"
          >
            <nav className="flex flex-col items-center gap-10">
              {[
                { label: 'Menu', href: '#' },
                { label: 'Our Story', href: '#' },
                { label: 'Locations', href: '#' },
              ].map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.07 * i, ease: [0.25, 0, 0, 1] }}
                  className="text-4xl font-bold tracking-widest uppercase text-white hover:opacity-50 transition-opacity"
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fixed Header */}
      <header className={`
        fixed top-0 left-0 right-0 z-50
        flex justify-between items-center pointer-events-none
        transition-all duration-300
        ${loadProgress === 100 ? 'opacity-100' : 'opacity-0'}
        ${menuOpen
          ? 'px-5 py-4 md:px-8 md:py-6 bg-transparent'
          : headerScrolled
            ? 'px-5 py-3 md:px-8 md:py-6 bg-black/85 backdrop-blur-md border-b border-white/10 md:bg-transparent md:backdrop-blur-none md:border-transparent'
            : 'px-5 py-4 md:px-8 md:py-6 mix-blend-difference bg-transparent'
        }
      `}>
        <a href="/" aria-label="Back to top" className="pointer-events-auto">
          <img src="/logo.png" alt="EAT.NUDES" className="h-7 md:h-8 invert object-contain" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-mono tracking-widest uppercase text-white pointer-events-auto">
          <a href="#" className="hover:opacity-60 transition-opacity">Menu</a>
          <a href="#" className="hover:opacity-60 transition-opacity">Our Story</a>
          <a href="#" className="hover:opacity-60 transition-opacity">Find Us</a>
        </nav>

        {/* Mobile hamburger / close button */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden pointer-events-auto text-white p-1 -mr-1"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          )}
        </button>
      </header>

      {/* Main Experience */}
      <div 
        ref={containerRef} 
        className={`relative w-full h-[400vh] transition-opacity duration-1000 ${loadProgress === 100 ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Canvas Component */}
          <MatchaCanvas onLoadProgress={setLoadProgress} smoothProgress={smoothProgress} />
          
          {/* Overlays Wrapper */}
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

      {/* Post-Scroll Content Sections */}
      <div className={`relative z-10 bg-black ${loadProgress === 100 ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}>
        {/* Ingredients / Craftsmanship */}
        <section className="py-20 md:py-32 px-6 md:px-24 border-t border-white/10">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl sm:text-3xl md:text-5xl font-light mb-10 md:mb-16">Clean. Fresh. Obsessive.</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-24">
              <div>
                <div className="h-[1px] w-12 bg-white/50 mb-6" />
                <h4 className="text-xl font-bold mb-4">No Filler. Ever.</h4>
                <p className="text-white/60 font-light leading-relaxed">Artificial colours, flavours, preservatives — none of them made the cut. If we can't say it out loud, it's not going in.</p>
              </div>
              <div>
                <div className="h-[1px] w-12 bg-white/50 mb-6" />
                <h4 className="text-xl font-bold mb-4">Made Every Morning</h4>
                <p className="text-white/60 font-light leading-relaxed">Rolls wrapped, bowls built, smoothies blended fresh daily. Because day-old health food isn't health food.</p>
              </div>
              <div>
                <div className="h-[1px] w-12 bg-white/50 mb-6" />
                <h4 className="text-xl font-bold mb-4">Your Way</h4>
                <p className="text-white/60 font-light leading-relaxed">Vegan, gluten-free, high-protein — you set the rules. We make sure you leave satisfied, whatever that looks like for you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="py-24 md:py-48 px-6 md:px-24 border-t border-white/10 relative overflow-hidden flex flex-col items-center text-center group cursor-pointer">
          {/* Subtle hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

          <h2 className="text-[clamp(2.25rem,8vw,6rem)] font-black tracking-tighter mb-6 md:mb-8 max-w-5xl z-10">
            FEED YOUR REAL SELF.
          </h2>
          <p className="text-base sm:text-lg md:text-2xl text-white/50 font-light mb-10 md:mb-12 max-w-2xl z-10">
            Carrer del Rec 10, El Born, Barcelona · C/ San Mateo 30, Alonso Martínez, Madrid. Open daily, no reservations required.
          </p>
          <button className="px-8 py-4 md:px-12 md:py-5 bg-white text-black font-bold tracking-widest uppercase text-sm hover:bg-white/90 hover:scale-105 transition-all duration-300 rounded-full z-10">
            Find a Location
          </button>
        </section>

        {/* Footer */}
        <footer className="py-16 md:py-24 px-6 md:px-24 border-t border-white/10 flex flex-col items-center">
          <img src="/logo.png" alt="EAT.NUDES Logo" className="h-12 md:h-16 invert mb-10 md:mb-12 object-contain" />
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm text-white/50 font-mono uppercase tracking-widest mb-12 md:mb-16">
            <a href="#" className="hover:text-white transition-colors">Menu</a>
            <a href="#" className="hover:text-white transition-colors">Our Story</a>
            <a href="#" className="hover:text-white transition-colors">Locations</a>
            <a href="https://www.instagram.com/eat.nudes/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Order Online</a>
          </div>
          <div className="flex flex-col items-center gap-2 text-xs text-white/30 font-mono tracking-wider text-center">
            <span>CARRER DEL REC 10, EL BORN, BARCELONA · C/ SAN MATEO 30, ALONSO MARTÍNEZ, MADRID</span>
            <span>© {new Date().getFullYear()} NUDES™. ALL RIGHTS RESERVED.</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
