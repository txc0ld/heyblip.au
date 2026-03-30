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
    <section className="relative min-h-screen flex items-center justify-center pt-20 md:pt-28 pb-16 md:pb-40 px-4 sm:px-6 overflow-hidden">
      {/* 3D mesh network background */}
      <MeshBackground />

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-6 md:gap-8"
      >
        {/* Pill badge */}
        <motion.div
          variants={childFadeUp}
          transition={{ duration: 0.6, ease }}
          className="glass rounded-full px-5 py-2 text-xs md:text-sm font-medium tracking-wide text-[var(--muted-strong)] uppercase"
        >
          No signal? No problem.
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={childFadeUp}
          transition={{ duration: 0.7, ease }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold tracking-tight leading-[1.1] md:leading-[1.06] text-gradient"
        >
          Never lose your
          <br />
          friends again.
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={childFadeUp}
          transition={{ duration: 0.7, ease }}
          className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-2xl leading-relaxed md:leading-[1.7]"
        >
          At festivals, phone signal dies. Blip doesn&apos;t need it.
          Your messages pass through other phones in the crowd
          until they reach your friends — like a digital whisper chain.
        </motion.p>

        {/* CTA buttons */}
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

        {/* Logo visual */}
        <motion.div
          variants={childFadeUp}
          transition={{ duration: 0.9, ease, delay: 0.05 }}
          className="mt-12 sm:mt-16 md:mt-24"
        >
          <Image
            src={resolved === "light" ? "/Blipblacklogo.png" : "/Blipwhitelogo.png"}
            alt="Blip"
            width={400}
            height={160}
            className="h-16 sm:h-24 md:h-36 lg:h-40 w-auto opacity-[0.85]"
            priority
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
