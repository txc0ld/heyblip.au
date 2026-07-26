"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ease } from "@/lib/animations";
import Nav from "@/components/Nav";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";

type Faq = {
  question: string;
  answer: string;
};

type Props = {
  faqs: Faq[];
};

function AppShot({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl border border-[var(--border)] bg-black">
      <Image
        src={src}
        alt={alt}
        width={853}
        height={1844}
        priority={priority}
        sizes="(min-width: 1024px) 320px, (min-width: 640px) 300px, 74vw"
        className="h-auto w-full"
      />
    </div>
  );
}

const facts = [
  { label: "Phone number", value: "Not required" },
  { label: "Identity", value: "Ed25519 key pair" },
  { label: "Add friends", value: "QR code or username" },
  { label: "Friend requests", value: "You approve each one" },
];

const sections = [
  {
    id: "identity",
    eyebrow: "Identity",
    heading: "Your profile, with no phone number required",
    body: [
      "Blip does not ask for your mobile number. When you install the app your iPhone generates an Ed25519 key pair, and that key is your identity on the mesh. On top of it you pick a display name, a handle and a short bio — the profile in this screenshot is Maya Wilson, @maya.wa.",
      "That is the whole setup. No SIM check, no contact list upload, no advertising identifier, no social graph mining. Your profile then carries the counts that matter at an event — friends and events — with your privacy and power settings stacked underneath.",
      "We would rather be precise than absolute here. Message content is end-to-end encrypted, and at an event it never passes through a Blip server. For exactly what is stored and what is not, read the privacy page.",
    ],
    shot: {
      src: "/app-screens/13-profile.png",
      alt: "Blip Profile screen for Maya Wilson, handle @maya.wa, showing 18 friends and 6 events above rows for Location sharing set to Friends only, Nearby visibility On, Notifications, Safety and SOS, Privacy and Security, and Battery mode set to All day",
      caption:
        "One screen: who you are, your friends and events counts, and every control over what other people can see.",
    },
    priority: true,
  },
  {
    id: "add-friends",
    eyebrow: "Friends",
    heading: "How to add friends by QR code or username",
    body: [
      "Open Add Friend and Blip puts your personal QR code on screen with your handle underneath it. A mate scans it from the Scan tab, or you tap Share my code and send it through any app you already use.",
      "Nothing to swap but the code. If typing is easier, Add by username does the same job. Either way the screen states the rule plainly: only people you approve become friends — requests do not go through automatically.",
      "It is worth trading codes before the crowd builds. With your friend list already set, Blip knows who to surface the moment reception gives out.",
    ],
    shot: {
      src: "/app-screens/10-add-friend.png",
      alt: "Blip Add Friend screen headed No phone number needed, showing a QR code above the handle @maya.wa, a Share my code button, My Code and Scan tabs, an Add by username option, and a note reading Only people you approve become friends",
      caption:
        "The Add Friend screen says it out loud — no phone number needed. QR code, scanner and username search in one place.",
    },
    priority: false,
  },
];

const privacyControls = [
  {
    title: "Location sharing",
    text: "Set to Friends only in the screenshot. Open the row to change who can see where you are, or to switch it off.",
  },
  {
    title: "Nearby visibility",
    text: "Its own toggle, shown On. Turn it off and you stop appearing to other people running Blip around you.",
  },
  {
    title: "Privacy & Security",
    text: "A dedicated screen for the rest of your privacy settings, separate from notifications and from Safety & SOS.",
  },
];

export default function ProfileClient({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="mesh-gradient relative overflow-hidden">
      <Nav />
      <Breadcrumb
        items={[{ label: "Features", href: "/features" }, { label: "Profile" }]}
      />

      {/* Hero */}
      <section className="px-6 pt-8 pb-16 md:pt-10 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="eyebrow mb-4">Profile</p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              A chat profile with no phone number
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted-strong)] md:text-xl md:leading-[1.7]">
              No, you do not need a phone number to use Blip. Your identity is a
              cryptographic key pair generated on your iPhone — Ed25519 — plus a
              display name and handle you choose. Friends are added by QR code or
              username, never by uploading your contacts. No ad-tech, no social
              graph mining.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/download"
                className="inline-flex min-h-11 items-center rounded-full bg-[var(--accent)] px-8 text-base font-semibold text-white transition-colors duration-200 hover:bg-[var(--accent-light)]"
              >
                Get Blip
              </Link>
              <span className="text-sm text-[var(--muted)]">
                Free on the App Store. iPhone, iOS 17+.
              </span>
            </div>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease }}
            className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4"
          >
            {facts.map((fact) => (
              <div key={fact.label} className="bg-[var(--background)] px-5 py-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-light)]">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-[var(--foreground)]">
                  {fact.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </section>

      {/* Subfunction sections with screens */}
      {sections.map((section, index) => (
        <section key={section.id} id={section.id} className="px-6 py-14 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="section-divider mb-14 md:mb-20" />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease }}
              className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
            >
              <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                <p className="eyebrow mb-4">{section.eyebrow}</p>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl">
                  {section.heading}
                </h2>
                <div className="mt-6 space-y-4">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 32)}
                      className="text-base leading-relaxed text-[var(--muted-strong)] md:text-[17px] md:leading-[1.75]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              <figure className={index % 2 === 1 ? "lg:order-1" : ""}>
                <AppShot
                  src={section.shot.src}
                  alt={section.shot.alt}
                  priority={section.priority}
                />
                <figcaption className="mx-auto mt-5 max-w-[340px] border-t border-[var(--border)] pt-4 text-sm leading-relaxed text-[var(--muted)]">
                  {section.shot.caption}
                </figcaption>
              </figure>
            </motion.div>
          </div>
        </section>
      ))}

      {/* Privacy controls */}
      <section id="privacy-controls" className="px-6 py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="section-divider mb-14 md:mb-20" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="eyebrow mb-4">Privacy</p>
            <h2 className="max-w-3xl text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl">
              Who can see your location, and who can find you
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted-strong)] md:text-[17px] md:leading-[1.75]">
              A private festival chat app has to make the privacy settings easy to
              find, not bury them four screens deep. Blip puts them on the profile
              itself, as separate rows, so you can change one without touching the
              rest.
            </p>

            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-3">
              {privacyControls.map((control) => (
                <div key={control.title} className="bg-[var(--background)] p-6">
                  <h3 className="text-base font-semibold text-[var(--foreground)]">
                    {control.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {control.text}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm text-[var(--muted)]">
              For what the app and our systems actually store, read the{" "}
              <Link
                href="/privacy"
                className="text-[var(--muted-strong)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
              >
                privacy policy
              </Link>
              . Emergency features live under{" "}
              <Link
                href="/features/safety"
                className="text-[var(--muted-strong)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
              >
                Safety &amp; SOS
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>

      {/* Battery mode */}
      <section id="battery-mode" className="px-6 py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="section-divider mb-14 md:mb-20" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
            className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"
          >
            <div>
              <p className="eyebrow mb-4">Power</p>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl">
                Battery mode: decide how hard the mesh works
              </h2>
              <div className="mt-6 space-y-4">
                <p className="text-base leading-relaxed text-[var(--muted-strong)] md:text-[17px] md:leading-[1.75]">
                  Battery mode sits at the bottom of your profile, shown here set
                  to All day. It is a power-management control, and it belongs on
                  the same screen as everything else you tune before a gate opens.
                </p>
                <p className="text-base leading-relaxed text-[var(--muted-strong)] md:text-[17px] md:leading-[1.75]">
                  Mesh networking means your phone spends time listening for and
                  relaying Bluetooth traffic on behalf of the crowd. This setting
                  is where you decide how much of that work it takes on.
                </p>
                <p className="text-base leading-relaxed text-[var(--muted-strong)] md:text-[17px] md:leading-[1.75]">
                  We are not going to quote you a battery-life figure. It depends
                  on your phone, the density of the crowd and how long you are out
                  there. Bring a power bank anyway — everyone at a festival should.
                </p>
              </div>
            </div>

            <div className="event-surface self-start rounded-2xl p-6 md:p-8">
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                On the profile screen
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
                <li>Location sharing — Friends only</li>
                <li>Nearby visibility — On</li>
                <li>Notifications</li>
                <li>Safety &amp; SOS</li>
                <li>Privacy &amp; Security</li>
                <li>Battery mode — All day</li>
              </ul>
              <p className="mt-6 border-t border-[var(--border)] pt-4 text-sm leading-relaxed text-[var(--muted)]">
                How the mesh itself behaves — hops, routing, encryption — is
                written up on the{" "}
                <Link
                  href="/tech"
                  className="text-[var(--muted-strong)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
                >
                  technical specs page
                </Link>
                .
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="section-divider mb-14 md:mb-20" />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
            className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl"
          >
            Profile and privacy questions, answered straight
          </motion.h2>

          <div className="mt-10 space-y-3 md:space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, ease, delay: index * 0.04 }}
                  className="event-surface overflow-hidden rounded-2xl"
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

      {/* Closing CTA */}
      <section className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="section-divider mb-14 md:mb-20" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
            className="event-surface rounded-2xl px-6 py-12 text-center md:px-12"
          >
            <h2 className="mx-auto max-w-xl text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl">
              Set up a profile, swap codes, go
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[var(--muted)] md:text-lg">
              Pick a handle, scan your crew in, and choose what they can see. No
              phone number goes anywhere.
            </p>
            <Link
              href="/download"
              className="mt-9 inline-flex min-h-11 items-center rounded-full bg-[var(--accent)] px-8 text-base font-semibold text-white transition-colors duration-200 hover:bg-[var(--accent-light)]"
            >
              Get Blip
            </Link>
            <p className="mt-5 text-xs text-[var(--muted)]">
              iPhone only. Requires iOS 17 or later. Read the{" "}
              <Link
                href="/privacy"
                className="text-[var(--muted-strong)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
              >
                privacy policy
              </Link>
              .
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
