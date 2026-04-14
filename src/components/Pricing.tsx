"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/animations";

const features = [
  "Unlimited messages",
  "Voice notes",
  "SOS alerts",
  "Event channels",
  "Nearby peer discovery",
  "BLE mesh relay",
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-16 md:py-24 px-4 sm:px-6">
      <div className="section-divider mb-0" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-14 md:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient mb-6 md:mb-8">
            Free. No catches.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
            Everything Blip offers, completely free. No tiers, no paywalls.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="max-w-md mx-auto"
        >
          <div className="glass-strong border-[var(--accent)]/30 relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col items-center text-center">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />

            <div className="mb-6 md:mb-8">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl md:text-5xl font-bold">$0</span>
              </div>
              <p className="text-sm md:text-[15px] text-[var(--muted)] mt-2 md:mt-3">
                Free for everyone, forever.
              </p>
            </div>

            <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10 w-full text-left">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-3 text-sm md:text-[15px] text-[var(--muted-strong)]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="flex-shrink-0 text-[var(--accent-light)]"
                  >
                    <path
                      d="M3 8l3.5 3.5L13 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href="https://apps.apple.com/app/blip"
              className="w-full px-8 py-3 md:px-10 md:py-3.5 rounded-full text-center text-sm md:text-base font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-light)] glow-accent-sm hover:glow-accent hover:scale-[1.02] transition-all duration-200"
            >
              Download Blip
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
