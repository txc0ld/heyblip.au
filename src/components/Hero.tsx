"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";
import { ease, stagger, childFadeUp } from "@/lib/animations";
import { useTheme } from "./ThemeProvider";

const MeshBackground = dynamic(() => import("./MeshBackground"), { ssr: false });

export default function Hero() {
  const { resolved } = useTheme();

  return (
    <section className="relative min-h-screen pt-20 md:pt-28 pb-16 md:pb-32 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* ── MOBILE: pill badge above mesh ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="lg:hidden flex justify-center mb-6 mt-2"
        >
          <div className="glass rounded-full px-5 py-2 text-xs font-medium tracking-wide text-[var(--muted-strong)] uppercase">
            No signal? No problem.
          </div>
        </motion.div>

        {/* ── MOBILE: mesh visualization (prominent, near top) ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease }}
          className="lg:hidden relative w-full aspect-square max-w-sm mx-auto mb-10 rounded-3xl overflow-hidden"
        >
          <MeshBackground />
        </motion.div>

        {/* ── DESKTOP: side-by-side layout ── */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 lg:gap-16 xl:gap-24">

          {/* Left: copy + CTAs */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="relative z-10 flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-5 md:gap-7"
          >
            {/* Desktop pill badge */}
            <motion.div
              variants={childFadeUp}
              transition={{ duration: 0.6, ease }}
              className="hidden lg:block glass rounded-full px-5 py-2 text-sm font-medium tracking-wide text-[var(--muted-strong)] uppercase"
            >
              No signal? No problem.
            </motion.div>

            <motion.h1
              variants={childFadeUp}
              transition={{ duration: 0.7, ease }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1] md:leading-[1.06] text-gradient"
            >
              Never lose your
              <br />
              friends again.
            </motion.h1>

            <motion.p
              variants={childFadeUp}
              transition={{ duration: 0.7, ease }}
              className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-xl leading-relaxed md:leading-[1.7]"
            >
              At festivals, phone signal dies. Blip doesn&apos;t need it.
              Your messages pass through other phones in the crowd
              until they reach your friends — like a digital whisper chain.
            </motion.p>

            <motion.div
              variants={childFadeUp}
              transition={{ duration: 0.7, ease }}
              className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-5 mt-2 md:mt-4 w-full sm:w-auto"
            >
              <a
                href="#pricing"
                className="w-full sm:w-auto px-8 md:px-10 py-3.5 md:py-4 rounded-full bg-[var(--accent)] text-white font-semibold text-base hover:bg-[var(--accent-light)] transition-all duration-300 glow-accent-sm hover:glow-accent hover:scale-[1.02] text-center"
              >
                Download for iOS
              </a>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 md:px-10 py-3.5 md:py-4 rounded-full border border-[var(--border-strong)] text-[var(--muted-strong)] font-medium text-base hover:text-[var(--foreground)] hover:border-[var(--muted)] transition-all duration-300 hover:scale-[1.02] text-center"
              >
                How does it work?
              </a>
            </motion.div>

            {/* Logo below CTAs on mobile, inline on desktop */}
            <motion.div
              variants={childFadeUp}
              transition={{ duration: 0.9, ease, delay: 0.05 }}
              className="mt-6 md:mt-10"
            >
              <Image
                src={resolved === "light" ? "/Blipblacklogo.png" : "/Blipwhitelogo.png"}
                alt="Blip"
                width={320}
                height={128}
                className="h-10 sm:h-14 md:h-16 lg:h-20 w-auto opacity-[0.85]"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Right: mesh visualization (desktop only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease, delay: 0.2 }}
            className="hidden lg:block flex-1 relative w-full max-w-xl aspect-square rounded-3xl overflow-hidden"
          >
            <MeshBackground />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
