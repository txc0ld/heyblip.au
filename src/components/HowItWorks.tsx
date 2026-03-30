"use client";

import { motion } from "framer-motion";
import { ease, stagger, childFadeUp } from "@/lib/animations";

const steps = [
  {
    number: "01",
    title: "Download & open",
    description:
      "Get Blip from the App Store. Open it when you arrive at the festival. That's it — no account needed.",
  },
  {
    number: "02",
    title: "Find your friends",
    description:
      "People with Blip show up automatically. Tap to add them as a friend — works just like any social app.",
  },
  {
    number: "03",
    title: "Send a message",
    description:
      "Type and send. Your message jumps from phone to phone through the crowd until it reaches your friend.",
  },
  {
    number: "04",
    title: "Never lose anyone",
    description:
      "Share your location, send voice notes, or hit SOS if you need help. All without a single bar of signal.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-16 md:py-24 px-4 sm:px-6">
      <div className="section-divider mb-16 md:mb-24" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient mb-5 md:mb-6">
            Dead simple.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
            If you can send a text, you can use Blip. No setup, no tech knowledge required.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={childFadeUp}
              transition={{ duration: 0.6, ease }}
              className="group text-center lg:text-left"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-xl md:text-2xl font-bold text-[var(--accent)] mx-auto lg:mx-0 mb-5 md:mb-6 group-hover:glow-accent-sm transition-all duration-300 group-hover:scale-105">
                {step.number}
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{step.title}</h3>
              <p className="text-sm md:text-[15px] text-[var(--muted)] leading-relaxed md:leading-[1.7]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
