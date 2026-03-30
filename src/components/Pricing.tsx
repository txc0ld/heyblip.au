"use client";

import { motion } from "framer-motion";
import { ease, stagger, childFadeUp } from "@/lib/animations";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Try the mesh. 10 messages included.",
    features: [
      "10 messages",
      "Nearby peer discovery",
      "BLE mesh relay",
      "SOS alerts (always free)",
    ],
    cta: "Download Free",
    accent: false,
  },
  {
    name: "Festival Pass",
    price: "$4.99",
    period: "/ festival",
    description: "Unlimited messaging for one event.",
    features: [
      "Unlimited messages",
      "Voice notes",
      "Image sharing",
      "Stage channels",
      "Friend finder map",
      "Priority relay",
    ],
    cta: "Get Festival Pass",
    accent: true,
  },
  {
    name: "Season",
    price: "$14.99",
    period: "/ year",
    description: "All festivals, all year. Best value.",
    features: [
      "Everything in Festival Pass",
      "Unlimited festivals",
      "Profile verification badge",
      "Early access to features",
      "Support development",
    ],
    cta: "Go Season",
    accent: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-16 md:py-24 px-4 sm:px-6">
      <div className="section-divider mb-16 md:mb-24" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient mb-8 md:mb-12">
            Simple pricing.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
            SOS alerts are always free. Pay only for messaging at festivals.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-7 lg:gap-8"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={childFadeUp}
              transition={{ duration: 0.6, ease }}
              className={`rounded-3xl p-6 sm:p-8 md:p-10 flex flex-col transition-all duration-300 hover:scale-[1.015] ${
                plan.accent
                  ? "glass-strong border-[var(--accent)]/30 relative overflow-hidden"
                  : "glass"
              }`}
            >
              {plan.accent && (
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
              )}

              <div className="mb-6 md:mb-8">
                <p className="text-sm text-[var(--muted)] font-medium mb-2 md:mb-3">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm md:text-base text-[var(--muted)]">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-sm md:text-[15px] text-[var(--muted)] mt-2 md:mt-3">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10 flex-1">
                {plan.features.map((feature) => (
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
                href="#"
                className={`w-full py-3.5 rounded-full text-center text-sm md:text-base font-semibold transition-all duration-300 ${
                  plan.accent
                    ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-light)] glow-accent-sm hover:glow-accent hover:scale-[1.02]"
                    : "border border-[var(--border-strong)] text-[var(--muted-strong)] hover:text-[var(--foreground)] hover:border-[var(--muted)] hover:scale-[1.02]"
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
