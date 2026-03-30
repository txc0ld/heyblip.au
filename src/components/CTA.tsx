"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/animations";

export default function CTA() {
  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-6">
      <div className="section-divider mb-0" />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] md:w-[800px] h-[250px] md:h-[400px] rounded-full bg-[var(--accent)] opacity-[0.05] md:opacity-[0.04] blur-[80px] md:blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.7, ease }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient mb-6 md:mb-8">
          Festival season is coming.
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-xl mx-auto mb-10 md:mb-14 leading-relaxed md:leading-[1.7]">
          Download Blip before you go. When the towers go down and the bass drops,
          you&apos;ll be glad you did.
        </p>
        <a
          href="https://apps.apple.com/app/blip"
          className="inline-block px-8 py-3 md:px-10 md:py-3.5 rounded-full bg-[var(--accent)] text-white font-semibold text-base md:text-lg hover:bg-[var(--accent-light)] transition-all duration-200 glow-accent-sm hover:glow-accent hover:scale-[1.03]"
        >
          Download for iOS
        </a>
        <p className="text-xs md:text-sm text-[var(--muted)] mt-6 md:mt-8">
          Free to try. Requires iPhone with iOS 17+.
        </p>
      </motion.div>
    </section>
  );
}
