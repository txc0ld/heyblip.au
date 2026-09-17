"use client";

import { KeyRound, ShieldCheck, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { ease } from "@/lib/animations";

const details = [
  { icon: ShieldCheck, label: "End-to-end encrypted", copy: "Direct messages and private group chats are encrypted on your device before they leave it. Public event channels are signed but not encrypted." },
  { icon: Smartphone, label: "Relays carry ciphertext", copy: "Phones that relay a direct or group message carry ciphertext they cannot open. They do see the packet header: sender and recipient IDs, packet type, and hop count." },
  { icon: KeyRound, label: "Cryptographic identity", copy: "Noise XX (Curve25519, ChaCha20-Poly1305, HKDF-SHA-256) protects sessions. Ed25519 signatures protect packet authenticity." },
];

export default function Security() {
  return (
    <section id="security" className="relative py-16 md:py-24 px-4 sm:px-6">
      <div className="section-divider mb-12 md:mb-16" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 md:gap-16 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease }}
          >
            <p className="eyebrow mb-4">Private by design</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gradient mb-6 md:mb-8">
              Relay through the crowd without exposing the conversation.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-[var(--muted-strong)] leading-relaxed md:leading-[1.7] mb-8 md:mb-10">
              Blip uses the phones around you as transport, not as trusted servers.
              For direct messages and private groups, they can help a packet move
              without seeing what is inside it. Public event channels are open to
              everyone at the event by design.
            </p>
            <a
              href="/tech"
              className="inline-flex items-center gap-2.5 text-sm md:text-base text-[var(--accent-light)] hover:text-[var(--foreground)] transition-all duration-200 font-semibold group"
            >
              See the technical specs
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="transition-transform duration-200 group-hover:translate-x-1">
                <path d="M6 4l4 4-4 4" />
              </svg>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="event-surface event-frame rounded-2xl p-6 sm:p-8 md:p-10"
          >
            <div className="signal-rule mb-8" />
            <div className="space-y-6">
              {details.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="grid grid-cols-[44px_1fr] gap-5">
                    <div className="h-11 w-11 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent-light)]">
                      <Icon size={20} strokeWidth={1.6} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--foreground)]">{item.label}</h3>
                      <p className="mt-1 text-sm md:text-[15px] text-[var(--muted)] leading-relaxed">{item.copy}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
