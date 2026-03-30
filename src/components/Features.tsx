"use client";

import { motion } from "framer-motion";
import { ease, stagger } from "@/lib/animations";

const features = [
  {
    emoji: "📡",
    title: "Works without signal",
    description:
      "No Wi-Fi, no mobile data, no problem. Blip uses Bluetooth to pass messages through people around you.",
  },
  {
    emoji: "👥",
    title: "Find your crew",
    description:
      "See who's nearby, add friends with a tap, and always know where your group is — even in a crowd of 100,000.",
  },
  {
    emoji: "💬",
    title: "Chat, voice notes & photos",
    description:
      "Send texts, voice messages, and photos to friends. Just like any chat app — except it works when nothing else does.",
  },
  {
    emoji: "🚨",
    title: "Emergency SOS",
    description:
      "Send an SOS alert that reaches every phone around you instantly. No throttling, no delays. Safety first.",
  },
  {
    emoji: "🔒",
    title: "Private by default",
    description:
      "Your messages are encrypted before they leave your phone. Nobody between you and your friend can read them — not even us.",
  },
  {
    emoji: "🎪",
    title: "Built for festivals",
    description:
      "Stage channels, crowd density info, lost & found, meeting points — everything you need for the perfect festival experience.",
  },
];

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function Features() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="section-divider mb-32" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient mb-4">
            Everything you need.
            <br />
            Nothing you don&apos;t.
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-lg mx-auto">
            Blip is the app you wish you had at your last festival.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              transition={{ duration: 0.5, ease }}
              className="glass rounded-3xl p-8 group hover:bg-[var(--card-bg-hover)] transition-colors duration-300"
            >
              <div className="text-3xl mb-5">{feature.emoji}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
