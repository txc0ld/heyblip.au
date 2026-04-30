"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ease } from "@/lib/animations";
import Nav from "@/components/Nav";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

export default function SupportClient() {
  return (
    <main className="mesh-gradient relative overflow-hidden">
      <Nav />
      <Breadcrumb items={[{ label: "Support" }]} />
      <section className="pt-8 md:pt-10 pb-20 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gradient mb-6">
            Support
          </h1>
          <p className="text-sm text-[var(--muted)] mb-14">Last updated: April 2026</p>

          <div className="space-y-10 text-[var(--muted-strong)] text-[15px] leading-[1.8]">
            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                Get in touch
              </h2>
              <p>
                The fastest way to reach us is by email. We&apos;re a small team based in Australia, and all three of us monitor the inbox.
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>
                  <strong>General help and bug reports:</strong>{" "}
                  <a
                    href="mailto:support@heyblip.au"
                    className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors"
                  >
                    support@heyblip.au
                  </a>
                </li>
                <li>
                  <strong>Safety and abuse reports:</strong>{" "}
                  <a
                    href="mailto:abuse@heyblip.au"
                    className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors"
                  >
                    abuse@heyblip.au
                  </a>
                </li>
                <li>
                  <strong>Privacy enquiries:</strong>{" "}
                  <a
                    href="mailto:privacy@heyblip.au"
                    className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors"
                  >
                    privacy@heyblip.au
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                Response times
              </h2>
              <p>
                We aim to respond to general support enquiries within{" "}
                <strong>2 business days</strong>. Safety and abuse reports are triaged faster — we acknowledge within 24 hours and act within 72 hours for most cases. Threats of violence, child-safety concerns, and other Tier-1 issues are escalated immediately.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                Common questions
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">
                    How do I delete my Blip account?
                  </h3>
                  <p>
                    Open the app, go to <strong>Profile → Settings → Account → Delete Account</strong>. Confirm the prompt. Your account, registered email hash, and public keys are permanently removed from our servers. Messages on other users&apos; devices remain (we cannot remotely delete encrypted content held by recipients), but your account can no longer authenticate or be discovered.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">
                    How do I report another user?
                  </h3>
                  <p>
                    The fastest path is to <strong>block the user</strong> directly — open their profile and tap Block. They can no longer send you messages, friend requests, or appear in your nearby peer list. To formally report harassment, abuse, or illegal content, email{" "}
                    <a
                      href="mailto:abuse@heyblip.au"
                      className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors"
                    >
                      abuse@heyblip.au
                    </a>{" "}
                    with the reported user&apos;s username and a description of what happened. Screenshots help. See our{" "}
                    <Link
                      href="/acceptable-use"
                      className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors"
                    >
                      Acceptable Use Policy
                    </Link>{" "}
                    for what we action.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">
                    I lost my phone — how do I get my account back?
                  </h3>
                  <p>
                    Blip identities are tied to a cryptographic key stored in your phone&apos;s secure enclave. If you&apos;ve set up a recovery kit (<strong>Profile → Settings → Backup</strong>), you can restore on a new device using the recovery file and the password you set. If you don&apos;t have a recovery kit, you can register a fresh account with the same email — friends will need to re-add you. For account-recovery edge cases, email{" "}
                    <a
                      href="mailto:support@heyblip.au"
                      className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors"
                    >
                      support@heyblip.au
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">
                    What data does Blip collect about me?
                  </h3>
                  <p>
                    The minimum needed to operate the service: your chosen username and display name, a one-way hash of your email address (we never store your email in plain text), your Noise and Ed25519 public keys, and Apple In-App Purchase transaction IDs if you&apos;ve bought message packs. We do <strong>not</strong> collect message content, location data (unless you opt in to location-sharing per friend), contact lists, advertising IDs, or browsing analytics. Full detail in our{" "}
                    <Link
                      href="/privacy"
                      className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">
                    Blip says &ldquo;no internet&rdquo; / I can&apos;t connect to friends
                  </h3>
                  <p>
                    Blip works over Bluetooth mesh, so it does not require internet to chat with friends physically near you. If you&apos;re trying to reach someone who is far away, the WebSocket relay handles off-mesh delivery — that does need internet on at least one side. If both you and your friend are stuck offline and not in Bluetooth range, messages will queue and deliver when one of you regains connectivity. If you&apos;re seeing &ldquo;Bluetooth required&rdquo; on a fresh install, check that Bluetooth permission is granted under iOS Settings → Blip.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--foreground)] mb-2">
                    I have feedback or a feature request
                  </h3>
                  <p>
                    We love it. Email{" "}
                    <a
                      href="mailto:hello@heyblip.au"
                      className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors"
                    >
                      hello@heyblip.au
                    </a>
                    {" "}with what you&apos;d like to see. We read every message, even when we can&apos;t reply individually.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                Safety and moderation
              </h2>
              <p>
                Blip is a peer-to-peer encrypted chat platform — we cannot read the content of direct messages or group messages. We rely on user reports and on-device blocking to surface and act on abuse. Public-facing surfaces (channel names, usernames, profile bios) are moderated server-side. For the full policy, including how reports are triaged, the moderation actions available, and how we cooperate with law enforcement, see our{" "}
                <Link
                  href="/acceptable-use"
                  className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors"
                >
                  Acceptable Use Policy
                </Link>
                .
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                Legal and reference
              </h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  {" "}— what we collect, what we don&apos;t, and how we handle it.
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Terms of Service
                  </Link>
                  {" "}— the agreement between you and HeyBlip.
                </li>
                <li>
                  <Link
                    href="/acceptable-use"
                    className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors"
                  >
                    Acceptable Use Policy
                  </Link>
                  {" "}— what is and isn&apos;t allowed on the network.
                </li>
                <li>
                  <Link
                    href="/tech"
                    className="text-[var(--accent-light)] hover:text-[var(--foreground)] transition-colors"
                  >
                    How Blip Works
                  </Link>
                  {" "}— the protocol, mesh design, and cryptography.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[var(--foreground)] mb-3">
                About us
              </h2>
              <p>
                Blip is built by a small team in Australia. We&apos;re bootstrapped, independent, and the software is engineered with privacy as a first-class concern. We don&apos;t sell ads, we don&apos;t sell data, and we don&apos;t track you across the web.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
      <Footer />
    </main>
  );
}
