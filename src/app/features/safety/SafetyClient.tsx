"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, Phone, Radio, ShieldAlert } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { childFadeUp, ease, stagger } from "@/lib/animations";

export type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  faqs: FaqItem[];
};

const relayFacts = [
  {
    label: "Relay probability",
    value: "100% for SOS, always — normal messages drop to 20% in dense crowds",
  },
  {
    label: "Hop limit",
    value: "7 hops, with TTL preserved for the first 3 hops of an SOS",
  },
  {
    label: "Persistence",
    value: "Store-and-forward keeps an SOS cached until it is resolved",
  },
  {
    label: "Transport",
    value: "Bluetooth Low Energy 5.0+ — no tower, no Wi-Fi, no server",
  },
  {
    label: "Encryption",
    value: "Noise XX key agreement with Ed25519 packet signing",
  },
];

function ScreenCard({
  src,
  alt,
  caption,
  priority = false,
}: {
  src: string;
  alt: string;
  caption: string;
  priority?: boolean;
}) {
  return (
    <figure className="mx-auto w-full max-w-[320px]">
      <div className="relative">
        <div className="pointer-events-none absolute -inset-8 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-black">
          <Image
            src={src}
            alt={alt}
            width={853}
            height={1844}
            priority={priority}
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 300px, 80vw"
            className="h-auto w-full"
          />
        </div>
      </div>
      <figcaption className="mt-4 border-t border-[var(--border)] pt-3 text-sm leading-relaxed text-[var(--muted)]">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function SafetyClient({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="mesh-gradient relative overflow-hidden">
      <Nav />
      <Breadcrumb items={[{ label: "Features", href: "/features" }, { label: "Safety" }]} />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="px-4 pb-16 pt-8 sm:px-6 md:pb-20 md:pt-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="eyebrow mb-5">Safety</p>
            <h1 className="mb-7 max-w-4xl text-4xl font-black leading-[0.94] tracking-[-0.04em] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Emergency SOS and safety at events with no signal.
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-[var(--muted-strong)] sm:text-lg md:text-xl">
              When there&apos;s no reception, open Blip and hold the SOS button. Your alert
              broadcasts over Bluetooth mesh, hopping phone to phone to every nearby Blip user —
              no tower, no Wi-Fi. SOS packets relay at full priority instead of being throttled.
              Blip does not call Triple Zero (000); it alerts the people around you.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/download"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 text-base font-bold text-white shadow-[0_18px_50px_rgba(102,0,255,0.26)] transition-all duration-200 hover:bg-[var(--accent-light)]"
              >
                Get Blip
                <ArrowRight size={18} strokeWidth={1.8} />
              </Link>
              <Link
                href="/tech"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-7 text-base font-semibold text-[var(--foreground)] transition-all duration-200 hover:border-[var(--accent)]/50"
              >
                How the mesh works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SOS broadcast ──────────────────────────────────── */}
      <section className="px-4 py-14 sm:px-6 md:py-20">
        <div className="section-divider mb-12 md:mb-16" />
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease }}
          >
            <Radio className="mb-5 text-[var(--accent-light)]" size={22} strokeWidth={1.7} />
            <h2 className="mb-6 max-w-3xl text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl">
              How does an emergency SOS reach people when there is no signal?
            </h2>
            <div className="grid gap-6 md:grid-cols-2 md:gap-10">
              <p className="text-base leading-relaxed text-[var(--muted-strong)] md:text-lg">
                An SOS is a broadcast, not a message to one person. Your phone pushes it to every
                Blip device in Bluetooth range, and each of those phones re-broadcasts it to its own
                neighbours. In a packed crowd that carries roughly 200 to 300 metres — far past the
                people who can see you.
              </p>
              <p className="text-base leading-relaxed text-[var(--muted)] md:text-lg">
                Ordinary messages get throttled as the crowd grows, so the mesh stays stable. SOS is
                exempt from that. It relays at 100% every time, and phones hold it in
                store-and-forward until it is resolved, so it keeps propagating as people move
                through the site.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-60px" }}
            className="event-surface mt-10 overflow-hidden rounded-2xl"
          >
            {relayFacts.map((fact, i) => (
              <motion.div
                key={fact.label}
                variants={childFadeUp}
                transition={{ duration: 0.4, ease }}
                className={`flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 ${
                  i < relayFacts.length - 1 ? "border-b border-[var(--border)]" : ""
                }`}
              >
                <span className="text-sm text-[var(--muted)]">{fact.label}</span>
                <span className="text-sm font-medium text-[var(--foreground)] sm:max-w-[62%] sm:text-right">
                  {fact.value}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Medical SOS flow ───────────────────────────────── */}
      <section className="px-4 py-14 sm:px-6 md:py-20">
        <div className="section-divider mb-12 md:mb-16" />
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease }}
          >
            <ShieldAlert className="mb-5 text-[var(--accent-light)]" size={22} strokeWidth={1.7} />
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl">
              How do you send a medical SOS at a festival?
            </h2>
            <p className="mb-5 text-base leading-relaxed text-[var(--muted-strong)] md:text-lg">
              Hold the button for two seconds. A ring fills as you press, so the alert only goes out
              when you mean it. The screen shows the zone that will travel with the alert and its
              accuracy, and marks the send as priority delivery over mesh.
            </p>
            <p className="mb-6 text-base leading-relaxed text-[var(--muted)] md:text-lg">
              You also set severity — green for minor, amber for moderate, red for severe — so
              whoever picks it up knows what they are walking into. Cancel sits on the same screen.
              While an event is live, the tab bar keeps the SOS entry one tap away.
            </p>
            <div className="grid gap-3">
              {[
                "Two-second hold, with a fill ring — no accidental sends",
                "Zone and accuracy shown before you send",
                "Severity: green minor, amber moderate, red severe",
              ].map((line) => (
                <div
                  key={line}
                  className="flex items-start gap-3 border-t border-[var(--border)] pt-3 text-sm text-[var(--muted-strong)]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                  {line}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease }}
          >
            <ScreenCard
              src="/app-screens/11-medical-sos.png"
              alt="Blip Medical SOS screen showing Zone C with 8 metre accuracy, a priority delivery over mesh badge, a red hold-to-send SOS button with a two-second timer, and green, amber and red severity options"
              caption="Medical SOS: location and accuracy up top, priority delivery over mesh, a hold-to-send button, and a severity picker with green, amber and red."
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* ── Medical dashboard ──────────────────────────────── */}
      <section className="px-4 py-14 sm:px-6 md:py-20">
        <div className="section-divider mb-12 md:mb-16" />
        <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease }}
            className="lg:order-1"
          >
            <ScreenCard
              src="/app-screens/12-medical-dashboard.png"
              alt="Blip Medical Dashboard screen showing a responder marked online, an event map with Zone A, Zone B and Zone C, a red SOS pin at Zone C with a dotted route from the responder, an alert card reading RED medical help needed with a Navigate button and 2 min 150 m, and a mesh plus relay delivery path status"
              caption="Medical Dashboard: a responder view. The SOS pin sits at Zone C with a route from the responder, the alert card reads RED · Medical help needed, and mesh + relay shows the delivery path is active."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease }}
            className="lg:order-2"
          >
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl">
              What does an event medic see when your SOS lands?
            </h2>
            <p className="mb-5 text-base leading-relaxed text-[var(--muted-strong)] md:text-lg">
              The responder-facing view puts the alert on the event map. The SOS pin drops on the
              zone it came from, with a route from wherever the responder is standing, a distance
              and walking estimate, and the severity you set. The delivery path shows whether the
              alert arrived direct or via relay.
            </p>
            <p className="mb-6 text-base leading-relaxed text-[var(--muted)] md:text-lg">
              This is the medical responder experience, not the attendee one — attendees send from
              the SOS screen above. Blip&apos;s wider dashboard tooling for event teams is still in
              development, so treat this as the capability shown on screen rather than a shipped
              organiser product.
            </p>
            <Link
              href="/organisers"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border-strong)] px-6 text-sm font-medium text-[var(--muted-strong)] transition-all duration-200 hover:border-[var(--accent)]/50 hover:text-[var(--foreground)]"
            >
              Talk to us about event safety comms
              <ArrowRight size={16} strokeWidth={1.8} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Disclaimer ─────────────────────────────────────── */}
      <section className="px-4 py-10 sm:px-6 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="mx-auto max-w-5xl rounded-2xl border border-[var(--border-strong)] bg-[var(--surface)] p-6 md:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
            <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/12 text-[var(--accent-light)]">
              <Phone size={18} strokeWidth={1.9} />
            </span>
            <div>
              <h2 className="mb-3 text-lg font-bold text-[var(--foreground)] md:text-xl">
                Blip is not a replacement for calling Triple Zero (000)
              </h2>
              <p className="text-sm leading-relaxed text-[var(--muted-strong)] md:text-base">
                Blip does not contact emergency services, event control, or any dispatch system. An
                SOS reaches nearby phones running Blip and nothing else. If you have any reception at
                all, call 000 first — or send someone to the nearest medical tent or staff member.
                Blip is there for the moments when the network has collapsed, and alongside official
                channels the rest of the time. It also depends on other people nearby having Blip
                installed with Bluetooth on, so treat it as one layer of your plan, not the whole
                plan.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────── */}
      <section className="px-4 py-14 sm:px-6 md:py-20">
        <div className="section-divider mb-12 md:mb-16" />
        <div className="mx-auto max-w-3xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
            className="mb-10 text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl md:mb-14 md:text-4xl"
          >
            Emergency SOS questions
          </motion.h2>

          <div className="space-y-3 md:space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, ease, delay: index * 0.04 }}
                  className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-[var(--card-bg-hover)] md:px-7 md:py-6"
                  >
                    <h3 className="text-base font-semibold text-[var(--foreground)] md:text-lg">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 text-[var(--muted)] transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--muted-strong)] md:px-7 md:pb-6 md:text-[15px] md:leading-[1.7]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ────────────────────────────────────── */}
      <section className="px-4 pb-20 pt-4 sm:px-6 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
          className="event-surface mx-auto max-w-5xl rounded-2xl p-8 text-center md:p-12"
        >
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
            Set it up before you need it.
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-[var(--muted)]">
            SOS only works if Blip is already on your phone and your crew&apos;s. Install it while
            you still have reception.
          </p>
          <Link
            href="/download"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 text-base font-bold text-white shadow-[0_18px_50px_rgba(102,0,255,0.26)] transition-all duration-200 hover:bg-[var(--accent-light)]"
          >
            Get Blip for iPhone
            <ArrowRight size={18} strokeWidth={1.8} />
          </Link>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
