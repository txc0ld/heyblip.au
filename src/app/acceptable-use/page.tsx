"use client";

import { motion } from "framer-motion";
import { ease } from "@/lib/animations";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function AcceptableUsePage() {
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
          <a href="/" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-8">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 4l-4 4 4 4" /></svg>
            Back to home
          </a>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient mb-4">Acceptable Use Policy</h1>
          <p className="text-sm text-[var(--muted)] mb-12">Last updated: March 2026</p>

          <div className="space-y-10 text-[var(--muted-strong)] text-[15px] leading-[1.8]">
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Purpose</h2>
              <p>This Acceptable Use Policy outlines the expected behaviour of all Blip users. Blip is built to keep people safe and connected at festivals — we expect all users to use the platform responsibly.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">You must not</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Send or facilitate the sending of spam, unsolicited messages, or bulk communications to users who have not consented.</li>
                <li>Transmit content that is illegal, defamatory, threatening, abusive, obscene, or that promotes violence or discrimination.</li>
                <li>Send false or misleading SOS alerts. The SOS system is for genuine emergencies only.</li>
                <li>Impersonate another person or entity, or falsely represent your affiliation with any person or organisation.</li>
                <li>Attempt to intercept, decrypt, modify, or tamper with messages being relayed through the Bluetooth mesh that are not intended for you.</li>
                <li>Exploit the mesh relay system to conduct denial-of-service attacks, packet flooding, or any activity designed to degrade network performance.</li>
                <li>Reverse-engineer the Blip protocol or cryptographic systems for the purpose of compromising user privacy or security.</li>
                <li>Use Blip to facilitate any activity that is illegal under Australian law or the laws of your jurisdiction.</li>
                <li>Harass, stalk, or intimidate other users through the platform.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Mesh relay responsibilities</h2>
              <p>Your device participates in the Bluetooth mesh network by relaying encrypted messages for other users. This is automatic and essential to how Blip works. While you cannot read relayed messages (they are encrypted), you should not attempt to interfere with, block, or selectively filter relay traffic.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Content responsibility</h2>
              <p>You are solely responsible for the content you send through Blip. Because messages are end-to-end encrypted, we cannot monitor or moderate message content. However, users can report and block other users, and we may take action on reported accounts.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Enforcement</h2>
              <p>Violations of this policy may result in temporary or permanent suspension of your Blip account. In serious cases (false SOS alerts, harassment, illegal activity), we may report the matter to relevant authorities. We reserve the right to determine what constitutes a violation at our sole discretion.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">Reporting</h2>
              <p>If you encounter a user violating this policy, you can block them directly in the app or report the issue to <a href="mailto:safety@heyblip.au" className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors">safety@heyblip.au</a>.</p>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
