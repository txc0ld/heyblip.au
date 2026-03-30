"use client";

import { Wifi, Users, MessageCircle, AlertTriangle, Lock, Tent } from "lucide-react";
import { motion } from "framer-motion";
import { ease, stagger, childFadeUp } from "@/lib/animations";

const features = [
  {
    icon: Wifi,
    title: "Works without signal",
    description:
      "No Wi-Fi, no mobile data, no problem. Blip uses Bluetooth to pass messages through people around you.",
  },
  {
    icon: Users,
    title: "Find your crew",
    description:
      "See who's nearby, add friends with a tap, and always know where your group is — even in a crowd of 100,000.",
  },
  {
    icon: MessageCircle,
    title: "Chat, voice notes & photos",
    description:
      "Send texts, voice messages, and photos to friends. Just like any chat app — except it works when nothing else does.",
  },
  {
    icon: AlertTriangle,
    title: "Emergency SOS",
    description:
      "Send an SOS alert that reaches every phone around you instantly. No throttling, no delays. Safety first.",
  },
  {
    icon: Lock,
    title: "Private by default",
    description:
      "Your messages are encrypted before they leave your phone. Nobody between you and your friend can read them — not even us.",
  },
  {
    icon: Tent,
    title: "Built for festivals",
    description:
      "Stage channels, crowd density info, lost & found, meeting points — everything you need for the perfect festival experience.",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-16 md:py-24 px-4 sm:px-6">
      <div className="section-divider mb-16 md:mb-24" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient mb-4 md:mb-5">
            Everything you need.
            <br />
            Nothing you don&apos;t.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
            Blip is the app you wish you had at your last festival.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7 lg:gap-8"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={childFadeUp}
                transition={{ duration: 0.6, ease }}
                className="glass rounded-3xl p-6 sm:p-8 md:p-10 group hover:bg-[var(--card-bg-hover)] transition-all duration-300 hover:scale-[1.015]"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent-light)] mb-5 md:mb-6 group-hover:bg-[var(--accent)]/20 transition-colors duration-300">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-sm md:text-[15px] text-[var(--muted)] leading-relaxed md:leading-[1.7]">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
