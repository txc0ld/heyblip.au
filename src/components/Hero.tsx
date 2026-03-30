"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ease, stagger, fadeUp } from "@/lib/animations";

const item = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-32 px-6">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[var(--accent)] opacity-[0.07] blur-[120px] pointer-events-none" />

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-6"
      >
        {/* Badge */}
        <motion.div
          variants={item}
          transition={{ duration: 0.5, ease }}
          className="glass rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-[var(--muted-strong)] uppercase"
        >
          No signal? No problem.
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          transition={{ duration: 0.6, ease }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] text-gradient"
        >
          Chat through
          <br />
          the crowd.
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={item}
          transition={{ duration: 0.6, ease }}
          className="text-lg sm:text-xl text-[var(--muted)] max-w-xl leading-relaxed"
        >
          Blip creates a Bluetooth mesh network between every phone at the
          festival. Your messages hop from device to device — reaching your
          friends even when mobile towers are overwhelmed.
        </motion.p>

        {/* CTA group */}
        <motion.div
          variants={item}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4"
        >
          <a
            href="#pricing"
            className="px-8 py-3.5 rounded-full bg-[var(--accent)] text-white font-semibold text-base hover:bg-[var(--accent-light)] transition-all duration-200 glow-accent-sm hover:glow-accent"
          >
            Download for iOS
          </a>
          <a
            href="#how-it-works"
            className="px-8 py-3.5 rounded-full border border-[var(--border-strong)] text-[var(--muted-strong)] font-medium text-base hover:text-white hover:border-[var(--muted)] transition-all duration-200"
          >
            See how it works
          </a>
        </motion.div>

        {/* Logo visual */}
        <motion.div
          variants={item}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="mt-20"
        >
          <Image
            src="/logo-white.png"
            alt="Blip"
            width={320}
            height={128}
            className="h-24 sm:h-32 w-auto opacity-90"
            priority
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
