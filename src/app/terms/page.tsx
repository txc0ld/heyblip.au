"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ease } from "@/lib/animations";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function TermsPage() {
  useEffect(() => { document.title = "Terms of Service — Blip"; }, []);

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
          <a href="/" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-all duration-200 mb-8">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 4l-4 4 4 4" /></svg>
            Back to home
          </a>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient mb-4">Terms of Service</h1>
          <p className="text-sm text-[var(--muted)] mb-12">Last updated: March 2026</p>

          <div className="space-y-10 text-[var(--muted-strong)] text-[15px] leading-[1.8]">
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">1. Acceptance</h2>
              <p>By downloading, installing, or using the Blip app (&quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">2. Description of Service</h2>
              <p>Blip is a Bluetooth mesh messaging application for iOS that enables peer-to-peer communication at events where traditional cellular and Wi-Fi connectivity may be unavailable. The Service includes text messaging, voice notes, image sharing, friend discovery, and emergency SOS alerts transmitted via Bluetooth Low Energy mesh networking.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">3. Eligibility</h2>
              <p>You must be at least 13 years of age to use Blip. If you are under 18, you must have parental or guardian consent. By using the Service, you represent that you meet these requirements.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">4. User accounts</h2>
              <p>You are responsible for maintaining the security of your device and your Blip identity. Your cryptographic keys are stored locally on your device. If you lose access to your device, your message history and identity may be unrecoverable unless you have created a recovery kit.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">5. Message packs and payments</h2>
              <p>Blip offers free and paid messaging tiers. Message packs are purchased via Apple In-App Purchase and are non-refundable except as required by applicable law. SOS alerts are always free regardless of your message balance. Pricing may change with notice.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">6. Mesh relay participation</h2>
              <p>By using Blip, your device may automatically relay encrypted messages for other users through the Bluetooth mesh network. This is a core feature of the Service. You cannot read or access relayed messages as they are end-to-end encrypted. Relay participation uses minimal battery and bandwidth.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">7. Prohibited conduct</h2>
              <p>You agree not to use the Service to: transmit illegal, threatening, or harassing content; impersonate others; send false SOS alerts; attempt to intercept, decrypt, or tamper with other users&apos; messages; reverse-engineer the mesh protocol for malicious purposes; or engage in any activity that disrupts the mesh network or degrades the experience for other users.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">8. SOS alerts</h2>
              <p>The SOS feature is designed for genuine emergencies at events. False SOS alerts are a violation of these Terms and may result in account suspension. SOS alerts are relayed at maximum priority through the mesh and may be visible to all nearby users.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">9. Limitation of liability</h2>
              <p>Blip is provided &quot;as is&quot; without warranty. We do not guarantee message delivery, mesh connectivity, or signal range. Blip is not a replacement for emergency services — always call 000 (Australia) or your local emergency number in life-threatening situations. To the maximum extent permitted by law, we are not liable for any damages arising from your use of the Service.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">10. Termination</h2>
              <p>We may suspend or terminate your access to the Service at any time for violation of these Terms. You may stop using the Service at any time by deleting the app.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">11. Governing law</h2>
              <p>These Terms are governed by the laws of Australia. Any disputes will be resolved in the courts of Australia.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">12. Contact</h2>
              <p>For questions about these Terms, contact us at <a href="mailto:legal@heyblip.au" className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors">legal@heyblip.au</a>.</p>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
