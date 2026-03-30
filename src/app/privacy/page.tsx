"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ease } from "@/lib/animations";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  useEffect(() => { document.title = "Privacy Policy — Blip"; }, []);

  return (
    <main className="mesh-gradient relative overflow-hidden">
      <Nav />
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient mb-6">Privacy Policy</h1>
          <p className="text-sm text-[var(--muted)] mb-14">Last updated: March 2026</p>

          <div className="space-y-10 text-[var(--muted-strong)] text-[15px] leading-[1.8]">
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Overview</h2>
              <p>Blip is designed with privacy as a core principle. We collect the absolute minimum data required to operate the service. Your messages are end-to-end encrypted — we cannot read them, and neither can anyone relaying them through the mesh.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">What we collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Username and display name</strong> — chosen by you during setup. Used to identify you to friends on the mesh.</li>
                <li><strong>Email address (hashed)</strong> — used for account verification only. We store a one-way hash, not your actual email.</li>
                <li><strong>Cryptographic public keys</strong> — your Noise protocol and Ed25519 public keys are shared with peers for encryption and signature verification.</li>
                <li><strong>Purchase records</strong> — transaction IDs for message pack purchases, processed by Apple via In-App Purchase.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">What we don&apos;t collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Message content — all messages are end-to-end encrypted before leaving your device.</li>
                <li>Location data — location sharing is opt-in and transmitted only to your chosen friends via the encrypted mesh.</li>
                <li>Contact lists or phone numbers.</li>
                <li>Device identifiers or advertising IDs.</li>
                <li>Browsing or usage analytics.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Bluetooth mesh relay</h2>
              <p>When your device relays messages for other users through the Bluetooth mesh, those messages are encrypted. Your device cannot decrypt or read relayed messages. Relay is automatic and helps the mesh network function — it does not expose any personal data.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Data storage</h2>
              <p>Your messages and friend list are stored locally on your device using SwiftData. Backend services (Cloudflare Workers + Neon Postgres) store only your hashed email, username, and public keys for account recovery and relay coordination. All backend communication is encrypted via TLS.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Third parties</h2>
              <p>We do not sell, share, or provide your data to any third parties. Apple processes In-App Purchases under their own privacy policy. Our backend runs on Cloudflare Workers and Neon Postgres — both operate under strict data processing agreements.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Your rights</h2>
              <p>You can delete your account and all associated data at any time from the app settings. You can export your data upon request. For any privacy-related enquiries, contact us at <a href="mailto:privacy@heyblip.au" className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors">privacy@heyblip.au</a>.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Changes</h2>
              <p>We may update this policy from time to time. Material changes will be communicated via the app. Continued use of Blip after changes constitutes acceptance of the updated policy.</p>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
