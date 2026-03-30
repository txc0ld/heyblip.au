"use client";

import { motion } from "framer-motion";
import { ease, stagger } from "@/lib/animations";

const steps = [
  {
    number: "01",
    title: "Open Blip",
    description:
      "Launch the app at the festival. Bluetooth starts scanning and advertising automatically.",
  },
  {
    number: "02",
    title: "Find your crew",
    description:
      "Nearby Blip users appear on the mesh. Add friends with a tap — no phone number needed.",
  },
  {
    number: "03",
    title: "Messages hop through",
    description:
      "Your message relays from phone to phone through the crowd. Up to 7 hops, reaching hundreds of metres.",
  },
  {
    number: "04",
    title: "Stay connected",
    description:
      "End-to-end encrypted DMs, group chats, voice notes, and SOS alerts — all over Bluetooth mesh.",
  },
];

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 px-6">
      <div className="section-divider mb-32" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient mb-4">
            Four taps to mesh.
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-lg mx-auto">
            No accounts, no QR codes, no server setup. Just Bluetooth and your crew.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={item}
              transition={{ duration: 0.5, ease }}
              className="relative flex gap-6 group"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl glass-strong flex items-center justify-center text-xl font-bold text-gradient-accent group-hover:glow-accent-sm transition-shadow duration-300">
                {step.number}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1.5">{step.title}</h3>
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
