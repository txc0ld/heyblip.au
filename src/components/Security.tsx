"use client";

import { motion } from "framer-motion";
import { ease, stagger } from "@/lib/animations";

const protocols = [
  { label: "Noise XX Handshake", detail: "Curve25519 + ChaChaPoly + SHA256" },
  { label: "Ed25519 Signatures", detail: "Every packet signed, tamper-proof" },
  { label: "Bloom Filter Dedup", detail: "3-tier (60s/10m/2h) prevents relay loops" },
  { label: "TTL-Exempt Signing", detail: "Relay nodes modify TTL without breaking sigs" },
];

const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function Security() {
  return (
    <section id="security" className="relative py-32 px-6">
      <div className="section-divider mb-32" />

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient mb-6">
              Encrypted by default.
            </h2>
            <p className="text-lg text-[var(--muted)] leading-relaxed mb-8">
              Every message is end-to-end encrypted before it leaves your phone.
              Relay nodes forward opaque bytes — they can see the packet exists,
              but never the content. Even SOS alerts are signed so they can't be forged.
            </p>
            <div className="glass rounded-2xl p-6">
              <p className="text-xs text-[var(--muted)] uppercase tracking-widest mb-4 font-medium">
                Protocol Stack
              </p>
              <motion.div
                variants={stagger}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                className="space-y-3"
              >
                {protocols.map((p) => (
                  <motion.div
                    key={p.label}
                    variants={item}
                    transition={{ duration: 0.4, ease }}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">{p.label}</span>
                    <span className="text-xs text-[var(--muted)]">{p.detail}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right: visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-72 h-72">
              {/* Concentric rings */}
              {[1, 2, 3].map((ring) => (
                <div
                  key={ring}
                  className="absolute inset-0 rounded-full border border-[var(--accent)]/10"
                  style={{
                    inset: `${ring * 24}px`,
                    animation: `pulse ${2 + ring * 0.5}s ease-in-out infinite`,
                    opacity: 0.3 / ring,
                  }}
                />
              ))}
              {/* Center lock */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-3xl bg-[var(--accent)]/20 border border-[var(--accent)]/30 flex items-center justify-center glow-accent">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="1.5">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.05); opacity: 0.25; }
        }
      `}</style>
    </section>
  );
}
