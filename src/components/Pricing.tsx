"use client";

import { motion } from "framer-motion";
import { ease, stagger } from "@/lib/animations";

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

const item = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-32 px-6">
      <div className="section-divider mb-32" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient mb-4">
            Simple pricing.
          </h2>
          <p className="text-lg text-[var(--muted)] max-w-lg mx-auto">
            SOS alerts are always free. Pay only for messaging at festivals.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={item}
              transition={{ duration: 0.5, ease }}
              className={`rounded-3xl p-8 flex flex-col ${
                plan.accent
                  ? "glass-strong border-[var(--accent)]/30 relative overflow-hidden"
                  : "glass"
              }`}
            >
              {plan.accent && (
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />
              )}

              <div className="mb-6">
                <p className="text-sm text-[var(--muted)] font-medium mb-2">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-[var(--muted)]">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--muted)] mt-2">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm text-[var(--muted-strong)]"
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
                className={`w-full py-3 rounded-full text-center text-sm font-semibold transition-all duration-200 ${
                  plan.accent
                    ? "bg-[var(--accent)] text-white hover:bg-[var(--accent-light)] glow-accent-sm hover:glow-accent"
                    : "border border-[var(--border-strong)] text-[var(--muted-strong)] hover:text-white hover:border-[var(--muted)]"
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
