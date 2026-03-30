"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/animations";

export default function Security() {
  return (
    <section id="security" className="relative py-16 md:py-32 px-4 sm:px-6">
      <div className="section-divider mb-16 md:mb-32" />

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gradient mb-4 sm:mb-6">
              Your messages.
              <br />
              Your business.
            </h2>
            <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-4 sm:mb-6">
              When your message passes through other phones to reach your friend,
              those phones can&apos;t read it. It&apos;s scrambled before it leaves
              your device and only unscrambled on your friend&apos;s.
            </p>
            <p className="text-base sm:text-lg text-[var(--muted)] leading-relaxed mb-6 sm:mb-8">
              No accounts. No phone numbers. No data collection. Just you and
              your crew.
            </p>
            <a
              href="/tech"
              className="inline-flex items-center gap-2 text-sm text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors duration-200 font-medium"
            >
              See the technical specs
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 4l4 4-4 4" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-48 h-48 md:w-72 md:h-72">
              {[1, 2, 3].map((ring) => (
                <div
                  key={ring}
                  className="absolute inset-0 rounded-full border border-[var(--accent)]/10"
                  style={{
                    inset: `${ring * 16}px`,
                    animation: `pulse ${2 + ring * 0.5}s ease-in-out infinite`,
                    opacity: 0.3 / ring,
                  }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-[var(--accent)]/20 border border-[var(--accent)]/30 flex items-center justify-center glow-accent">
                  <span className="text-3xl md:text-4xl">🔒</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.05); opacity: 0.25; }
        }
      `}</style>
    </section>
  );
}
