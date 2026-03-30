"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/animations";

export default function CTA() {
  return (
    <section className="relative py-32 px-6">
      <div className="section-divider mb-32" />

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[var(--accent)] opacity-[0.06] blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gradient mb-6">
          Ready for the drop?
        </h2>
        <p className="text-lg text-[var(--muted)] max-w-xl mx-auto mb-10">
          Download Blip before your next festival. When the towers go down, the mesh goes up.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#"
            className="px-10 py-4 rounded-full bg-[var(--accent)] text-white font-semibold text-lg hover:bg-[var(--accent-light)] transition-all duration-200 glow-accent-sm hover:glow-accent"
          >
            Download for iOS
          </a>
        </div>
        <p className="text-xs text-[var(--muted)] mt-6">
          Requires iOS 17+. Bluetooth LE required.
        </p>
      </motion.div>
    </section>
  );
}
