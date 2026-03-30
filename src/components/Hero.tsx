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
    <section className="relative min-h-screen flex items-center pt-32 md:pt-44 pb-12 md:pb-16 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">

        {/* ── Desktop: side-by-side grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 xl:gap-20 items-center max-w-6xl mx-auto">

          {/* Left column: badge + (mobile: mesh) + copy */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            {/* Mobile mesh — first visual on mobile */}
            <motion.div
              variants={childFadeUp}
              transition={{ duration: 0.8, ease }}
              className="lg:hidden w-full max-w-xs aspect-square mx-auto mb-8 rounded-2xl overflow-hidden glass"
            >
              <MeshBackground />
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={childFadeUp}
              transition={{ duration: 0.7, ease }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.08] text-gradient mb-6 md:mb-7"
            >
              Never lose your
              <br />
              friends again.
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={childFadeUp}
              transition={{ duration: 0.7, ease }}
              className="text-base sm:text-lg lg:text-xl text-[var(--muted)] max-w-lg leading-relaxed lg:leading-[1.7] mb-8 md:mb-10"
            >
              At festivals, phone signal dies. Blip doesn&apos;t need it.
              Your messages pass through other phones in the crowd
              until they reach your friends — like a digital whisper chain.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={childFadeUp}
              transition={{ duration: 0.7, ease }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-3 sm:gap-4 w-full sm:w-auto mb-10 md:mb-12"
            >
              <a
                href="#pricing"
                className="w-full sm:w-auto px-8 lg:px-10 py-3.5 lg:py-4 rounded-full bg-[var(--accent)] text-white font-semibold text-base hover:bg-[var(--accent-light)] transition-all duration-300 glow-accent-sm hover:glow-accent hover:scale-[1.02] text-center"
              >
                Download for iOS
              </a>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 lg:px-10 py-3.5 lg:py-4 rounded-full border border-[var(--border-strong)] text-[var(--muted-strong)] font-medium text-base hover:text-[var(--foreground)] hover:border-[var(--muted)] transition-all duration-300 hover:scale-[1.02] text-center"
              >
                How does it work?
              </a>
            </motion.div>

            {/* Logo */}
            <motion.div
              variants={childFadeUp}
              transition={{ duration: 0.9, ease, delay: 0.05 }}
            >
              <Image
                src={resolved === "light" ? "/Blipblacklogo.png" : "/Blipwhitelogo.png"}
                alt="Blip"
                width={200}
                height={80}
                className="h-8 sm:h-10 lg:h-12 w-auto opacity-[0.7]"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Right column: mesh (desktop only) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease, delay: 0.15 }}
            className="hidden lg:block relative w-full"
          >
            <div className="relative aspect-square w-[420px] xl:w-[480px] rounded-3xl overflow-hidden glass">
              <MeshBackground />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
