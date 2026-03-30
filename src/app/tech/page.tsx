"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ease, stagger } from "@/lib/animations";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const specs = [
  {
    category: "Mesh Network",
    items: [
      { label: "Transport", value: "Bluetooth Low Energy 5.0+" },
      { label: "Topology", value: "Dual-role (central + peripheral simultaneously)" },
      { label: "Max connections", value: "6 per device (configurable for bridge nodes)" },
      { label: "Service UUID", value: "FC000001-0000-1000-8000-00805F9B34FB" },
      { label: "MTU", value: "512 bytes (517 requested, 512 effective)" },
      { label: "Hop limit (TTL)", value: "0–7 hops per packet" },
      { label: "Range per hop", value: "~40m (BLE 5.0, line-of-sight up to 100m)" },
      { label: "Effective range", value: "~200–300m through crowd (7 hops)" },
    ],
  },
  {
    category: "Gossip Routing",
    items: [
      { label: "Algorithm", value: "Probabilistic gossip with adaptive relay" },
      { label: "Deduplication", value: "3-tier Bloom filter (60s / 10min / 2hr windows)" },
      { label: "Relay probability", value: "100% (<10 peers) → 20% (60+ peers)" },
      { label: "SOS relay", value: "Always 100%, TTL preserved for first 3 hops" },
      { label: "Jitter", value: "8–25ms random per relay (prevents synchronized flooding)" },
      { label: "Congestion backoff", value: "Queue fill >80% reduces relay to 20%" },
      { label: "DM routing (at scale)", value: "DirectedRouter with 5-min route expiry" },
      { label: "Store-and-forward", value: "10MB LRU cache, DMs cached 2hrs, SOS until resolved" },
    ],
  },
  {
    category: "Encryption",
    items: [
      { label: "Key agreement", value: "Noise XX handshake (Curve25519 + ChaChaPoly + SHA256)" },
      { label: "Packet signing", value: "Ed25519 via libsodium (64-byte detached signatures)" },
      { label: "Signable data", value: "Full packet excluding TTL byte and signature (spec §7.3)" },
      { label: "Relay compatibility", value: "TTL excluded from signed data — relay nodes decrement without breaking sig" },
      { label: "Key distribution", value: "Noise + signing public keys exchanged in announce payload" },
      { label: "Session management", value: "Noise session per peer pair, rekeying on reconnect" },
    ],
  },
  {
    category: "Packet Format",
    items: [
      { label: "Header", value: "16 bytes fixed (version, type, TTL, timestamp, flags, length)" },
      { label: "Sender ID", value: "8 bytes (SHA256 of noise public key, truncated)" },
      { label: "Recipient ID", value: "8 bytes (optional, for addressed DMs)" },
      { label: "Signature", value: "64 bytes (optional, Ed25519)" },
      { label: "Max payload (broadcast signed)", value: "424 bytes" },
      { label: "Max payload (addressed signed)", value: "416 bytes" },
      { label: "Fragmentation threshold", value: "416 bytes" },
      { label: "Byte order", value: "Big-endian (network byte order)" },
    ],
  },
  {
    category: "Scale Design",
    items: [
      { label: "Target", value: "100,000+ concurrent users" },
      { label: "Crowd modes", value: "Gather (<500) / Festival (500–5K) / Mega (5K–25K) / Massive (25K+)" },
      { label: "RSSI polling", value: "Every 10 seconds for connected peers" },
      { label: "Peer evaluation", value: "30-second cycle for connection quality scoring" },
      { label: "Reconnect backoff", value: "30 seconds (reduced from 120s for density)" },
      { label: "Stale peer cleanup", value: "Disconnected peers pruned after 5 minutes" },
    ],
  },
  {
    category: "Platform",
    items: [
      { label: "iOS", value: "17.0+ (SwiftUI, SwiftData, MVVM)" },
      { label: "Packages", value: "BlipProtocol, BlipMesh, BlipCrypto (Swift Package Manager)" },
      { label: "Dependencies", value: "CryptoKit (Apple), swift-sodium, swift-opus" },
      { label: "Backend", value: "Cloudflare Workers (auth, relay) + Neon Postgres" },
      { label: "Build", value: "XcodeGen + xcodebuild" },
    ],
  },
];

export default function TechPage() {
  useEffect(() => { document.title = "Technical Specs — Blip"; }, []);

  return (
    <main className="mesh-gradient relative overflow-hidden">
      <Nav />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-20"
          >
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-all duration-200 mb-12"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 4l-4 4 4 4" />
              </svg>
              Back to home
            </a>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gradient mb-6">
              Technical Specs
            </h1>
            <p className="text-lg text-[var(--muted)] max-w-2xl">
              The engineering behind Blip&apos;s BLE mesh network. Built for
              festival-scale crowds with end-to-end encryption, adaptive gossip
              routing, and Ed25519 packet authentication.
            </p>
          </motion.div>

          <div className="space-y-12">
            {specs.map((section, sectionIndex) => (
              <motion.div
                key={section.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, ease, delay: sectionIndex * 0.05 }}
              >
                <h2 className="text-xs uppercase tracking-widest text-[var(--accent-light)] font-semibold mb-4">
                  {section.category}
                </h2>
                <div className="glass rounded-2xl overflow-hidden">
                  <motion.div
                    variants={stagger}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                  >
                    {section.items.map((spec, i) => (
                      <motion.div
                        key={spec.label}
                        variants={item}
                        transition={{ duration: 0.3, ease }}
                        className={`flex items-center justify-between px-6 py-3.5 ${
                          i < section.items.length - 1
                            ? "border-b border-[var(--border)]"
                            : ""
                        }`}
                      >
                        <span className="text-sm text-[var(--muted-strong)]">
                          {spec.label}
                        </span>
                        <span className="text-sm font-medium text-right max-w-[60%]">
                          {spec.value}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease }}
            className="mt-16 glass rounded-2xl p-8 text-center"
          >
            <h3 className="text-lg font-semibold mb-2">Open development</h3>
            <p className="text-sm text-[var(--muted)] mb-4">
              Blip is built in the open. Check out the source, report issues, or
              contribute.
            </p>
            <a
              href="https://github.com/txc0ld/FezChat"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[var(--border-strong)] text-sm font-medium text-[var(--muted-strong)] hover:text-[var(--foreground)] hover:border-[var(--muted)] transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
