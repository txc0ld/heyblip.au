"use client";

import { motion } from "framer-motion";
import { ease, stagger, childFadeUp } from "@/lib/animations";

const benefits = [
  {
    title: "Purple verified badge",
    description: "Visible on your profile and in every chat.",
  },
  {
    title: "Priority in Nearby",
    description: "Appear higher in peer discovery results.",
  },
  {
    title: "Trust indicator",
    description: "Friends see you're a verified community member.",
  },
  {
    title: "Early access to features",
    description: "Try new drops before anyone else.",
  },
  {
    title: "Support development",
    description: "Help keep the mesh running and the roadmap moving.",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative pt-16 md:pt-24 pb-16 md:pb-24 px-4 sm:px-6">
      <div className="section-divider mb-20 md:mb-28" />

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-14 md:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient mb-6 md:mb-8">
            Get Verified.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
            Stand out and build trust in the mesh. Messaging and SOS alerts are always free.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-xl mx-auto"
        >
          <motion.div
            variants={childFadeUp}
            transition={{ duration: 0.6, ease }}
            className="rounded-3xl p-8 sm:p-10 md:p-12 flex flex-col glass-strong border-[var(--accent)]/30 relative overflow-hidden transition-all duration-200 hover:scale-[1.015]"
          >
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />

            <div className="mb-8 md:mb-10 text-center">
              <p className="text-sm text-[var(--muted)] font-medium mb-3 md:mb-4 uppercase tracking-wide">
                Verified Profile
              </p>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl md:text-6xl font-bold">$15</span>
                <span className="text-sm md:text-base text-[var(--muted)]">
                  one-time
                </span>
              </div>
              <p className="text-sm md:text-[15px] text-[var(--muted)] mt-3 md:mt-4">
                Pay once. Verified forever.
              </p>
            </div>

            <ul className="space-y-4 md:space-y-5 mb-10 md:mb-12">
              {benefits.map((benefit) => (
                <li
                  key={benefit.title}
                  className="flex items-start gap-3 md:gap-4"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="flex-shrink-0 text-[var(--accent-light)] mt-[3px]"
                  >
                    <path
                      d="M3 8l3.5 3.5L13 5"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <p className="text-[15px] md:text-base font-medium text-[var(--foreground)]">
                      {benefit.title}
                    </p>
                    <p className="text-sm md:text-[15px] text-[var(--muted)] mt-0.5">
                      {benefit.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <a
              href="https://apps.apple.com/app/blip"
              className="w-full px-8 py-3 md:px-10 md:py-3.5 rounded-full text-center text-sm md:text-base font-semibold transition-all duration-200 bg-[var(--accent)] text-white hover:bg-[var(--accent-light)] glow-accent-sm hover:glow-accent hover:scale-[1.02]"
            >
              Get Verified
            </a>
            <p className="text-center text-xs md:text-sm text-[var(--muted)] mt-5">
              Billing questions? <a href="mailto:billing@heyblip.au" className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors">billing@heyblip.au</a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
