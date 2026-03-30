"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/animations";

export default function CTA() {
  return (
    <section className="relative py-16 md:py-32 px-4 sm:px-6">
      <div className="section-divider mb-16 md:mb-32" />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--accent)] opacity-[0.06] blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gradient mb-4 sm:mb-6">
          Festival season is coming.
        </h2>
        <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl mx-auto mb-8 sm:mb-10">
          Download Blip before you go. When the towers go down and the bass drops,
          you&apos;ll be glad you did.
        </p>
        <a
          href="#"
          className="inline-block px-10 py-4 rounded-full bg-[var(--accent)] text-white font-semibold text-base sm:text-lg hover:bg-[var(--accent-light)] transition-all duration-200 glow-accent-sm hover:glow-accent"
        >
          Download for iOS
        </a>
        <p className="text-xs text-[var(--muted)] mt-5 sm:mt-6">
          Free to try. Requires iPhone with iOS 17+.
        </p>
      </motion.div>
    </section>
  );
}
