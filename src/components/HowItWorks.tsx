"use client";

import { motion } from "framer-motion";
import { ease, stagger } from "@/lib/animations";

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

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-16 md:py-32 px-4 sm:px-6">
      <div className="section-divider mb-16 md:mb-32" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gradient mb-4">
            Dead simple.
          </h2>
          <p className="text-base sm:text-lg text-[var(--muted)] max-w-lg mx-auto">
            If you can send a text, you can use Blip. No setup, no tech knowledge required.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={item}
              transition={{ duration: 0.5, ease }}
              className="relative flex gap-4 sm:gap-6 group"
            >
              <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl glass-strong flex items-center justify-center text-lg sm:text-xl font-bold text-gradient-accent group-hover:glow-accent-sm transition-shadow duration-300">
                {step.number}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-1.5">{step.title}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
