"use client";

import { motion } from "framer-motion";
import { ease, stagger } from "@/lib/animations";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <circle cx="8" cy="10" r="1.5" fill="currentColor" />
        <circle cx="16" cy="10" r="1.5" fill="currentColor" />
        <circle cx="12" cy="15" r="1.5" fill="currentColor" />
        <path d="M8 10l4 5m4-5l-4 5" strokeWidth="1" />
      </svg>
    ),
    title: "Bluetooth Mesh",
    description:
      "Your message hops from phone to phone through the crowd. No cell towers, no Wi-Fi, no internet required.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
      </svg>
    ),
    title: "End-to-End Encrypted",
    description:
      "Noise XX protocol with Ed25519 signatures. Relay nodes see only encrypted bytes — never your messages.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Find Your Friends",
    description:
      "See who's nearby on the mesh. Add friends, share your location, and never lose your crew in the crowd.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <circle cx="12" cy="16" r="0.5" fill="currentColor" />
      </svg>
    ),
    title: "SOS Alerts",
    description:
      "Emergency alerts bypass all throttling and reach every device in the mesh. Always relayed at 100%.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Scales to 100K+",
    description:
      "Adaptive relay probability, congestion backoff, and 3-tier Bloom filter dedup. Designed for Glastonbury-scale crowds.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
    title: "Stage Channels",
    description:
      "Auto-join location-based chat channels for each stage. Share the vibe with everyone around you.",
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
            Built for the crowd.
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-lg mx-auto">
            Everything you need when cell towers fail and the music is too loud to yell.
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
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent-light)] mb-5 group-hover:bg-[var(--accent)]/20 transition-colors duration-300">
                {feature.icon}
              </div>
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
