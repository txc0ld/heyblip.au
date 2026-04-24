"use client";

import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { ease } from "@/lib/animations";

export default function Security() {
  return (
    <section id="security" className="relative py-16 md:py-24 px-4 sm:px-6">
      <div className="section-divider mb-12 md:mb-16" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 lg:gap-28 items-center">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient mb-6 md:mb-8">
              Your messages.
              <br />
              Your business.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] leading-relaxed md:leading-[1.7] mb-5 md:mb-6">
              When your message passes through other phones to reach your friend,
              those phones can&apos;t read it. It&apos;s scrambled before it leaves
              your device and only unscrambled on your friend&apos;s.
            </p>
            <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] leading-relaxed md:leading-[1.7] mb-8 md:mb-10">
              No accounts. No phone numbers. No data collection. Just you and
              your crew.
            </p>
            <a
              href="/tech"
              className="inline-flex items-center gap-2.5 text-sm md:text-base text-[var(--accent-light)] hover:text-[var(--foreground)] transition-all duration-200 font-medium group"
            >
              See the technical specs
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-200 group-hover:translate-x-1">
                <path d="M6 4l4 4-4 4" />
              </svg>
            </a>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.8, ease, delay: 0.1 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80">
              {/* Concentric rings with breathing animation */}
              {[1, 2, 3, 4].map((ring) => (
                <div
                  key={ring}
                  className="absolute rounded-full border"
                  style={{
                    inset: `${ring * 18}px`,
                    borderColor: `rgba(102, 0, 255, ${0.15 / ring})`,
                    animation: `breathe ${2.5 + ring * 0.6}s ease-in-out infinite`,
                    animationDelay: `${ring * 0.3}s`,
                  }}
                />
              ))}
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[var(--accent)]/15 border border-[var(--accent)]/25 flex items-center justify-center glow-accent text-[var(--accent-light)]">
                  <ShieldCheck size={36} strokeWidth={1.5} className="md:w-11 md:h-11" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.08); opacity: 0.7; }
        }
      `}</style>
    </section>
  );
}
