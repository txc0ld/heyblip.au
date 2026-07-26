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
  { label: "Transport", value: "Bluetooth Low Energy 5.0+" },
  { label: "Hop limit", value: "7 hops per message" },
  { label: "Key agreement", value: "Noise XX handshake" },
  { label: "Packet signing", value: "Ed25519" },
];

const sections = [
  {
    id: "group-chats",
    eyebrow: "Group chats",
    heading: "Group chats that work with zero bars",
    body: [
      "Make a thread for your crew before you walk in. Once reception dies, the thread keeps running — every message you send broadcasts to nearby iPhones on Blip, and each of those phones passes it on.",
      "That is what makes it a group chat without internet: the crowd is the network. Nobody needs to be paired, added by phone number, or connected to anything. If a friend is a few hops away through the crowd, your message still lands.",
    ],
    shot: {
      src: "/app-screens/08-encrypted-chat.png",
      alt: "Blip group chat thread called Festival Crew, showing messages from Maya and Jake including \"no signal here\" and a reply saying \"Blip still works\"",
      caption:
        "A live Festival Crew thread — sender names, timestamps, read ticks, and replies quoting an earlier message.",
    },
    priority: true,
  },
  {
    id: "encrypted-messaging",
    eyebrow: "Encryption",
    heading: "Encrypted chat with no signal — and no relay can read it",
    body: [
      "Every thread runs end-to-end encrypted. Keys are agreed with a Noise XX handshake, and packets are signed with Ed25519, so a phone that relays your message is carrying ciphertext it cannot open.",
      "That matters more on a mesh than on a normal messenger. Your words physically travel through other people's phones. They arrive sealed, they leave sealed, and the relay only ever sees enough to forward the packet.",
      "It is strong, standard cryptography — not a proprietary scheme, and not military-grade marketing.",
    ],
    shot: {
      src: "/app-screens/07-chat-list.png",
      alt: "Blip Chats screen listing Festival Crew, Maya, Trackside Chat and Priya, with padlock badges on direct message avatars",
      caption:
        "Padlock badges mark encrypted direct messages. The header of every thread says end-to-end encrypted, in plain words.",
    },
    priority: false,
  },
  {
    id: "voice",
    eyebrow: "Voice",
    heading: "Push-to-talk that works like a walkie talkie without service",
    body: [
      "Hold the mic, talk, release to send. The clip compresses and relays phone-to-phone through the same mesh your text uses — no tower, no Wi-Fi, no Zello-style server in the middle.",
      "It is the walkie talkie behaviour people want at a festival, minus the requirement that everyone has bars. Sent clips are marked so you can see they went out via mesh rather than the network.",
      "Keep them short when the crowd is thick. Bigger payloads take more hops and more time.",
    ],
    shot: {
      src: "/app-screens/09-voice-ptt.png",
      alt: "Blip push-to-talk screen with a large purple microphone button reading 00:08 and Release to send, above two playable voice notes marked Sent via mesh",
      caption:
        "Hold-to-record with a live timer, playable waveforms above it, and a Sent via mesh label on the delivered clip.",
    },
    priority: false,
  },
];

const threadPoints = [
  {
    title: "One list, everything in it",
    text: "Group threads, direct messages and event chats sit in the same Chats tab, newest first, with unread counts.",
  },
  {
    title: "Search across messages",
    text: "Find the thread where someone dropped a meeting point without scrolling back through a day of chat.",
  },
  {
    title: "Voice notes inline",
    text: "Recorded clips appear in the list with a waveform and duration, so you can see what is waiting before you open it.",
  },
];

export default function ChatClient({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="mesh-gradient relative overflow-hidden">
      <Nav />
      <Breadcrumb items={[{ label: "Features", href: "/features" }, { label: "Chat" }]} />

      {/* Hero */}
      <section className="px-6 pt-8 pb-16 md:pt-10 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="eyebrow mb-4">Chat</p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Group chat that works with no signal
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted-strong)] md:text-xl md:leading-[1.7]">
              You group chat with no signal by letting phones talk to each other
              directly. Blip uses Bluetooth Low Energy mesh: your message
              broadcasts to nearby iPhones running Blip, and each one relays it
              onward, up to seven hops. No towers, no Wi-Fi, no server. Everything
              stays end-to-end encrypted along the way.
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

      {/* Subfunction sections */}
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

      {/* Chat list / threads */}
      <section id="threads" className="px-6 py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="section-divider mb-14 md:mb-20" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="eyebrow mb-4">Threads</p>
            <h2 className="max-w-3xl text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl">
              Your crew, your DMs and the event in one chat list
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted-strong)] md:text-[17px] md:leading-[1.75]">
              An offline group chat app is only useful if you can find the right
              thread while you are walking through a crowd. Blip keeps the Chats
              tab boringly familiar — search at the top, threads below, unread
              counts on the right.
            </p>

            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-3">
              {threadPoints.map((point) => (
                <div key={point.title} className="bg-[var(--background)] p-6">
                  <h3 className="text-base font-semibold text-[var(--foreground)]">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    {point.text}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm text-[var(--muted)]">
              Want the protocol detail?{" "}
              <Link
                href="/tech"
                className="text-[var(--muted-strong)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
              >
                Read the technical specs
              </Link>
              .
            </p>
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
            Chat questions, answered straight
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
              Set the group chat up before you lose signal
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[var(--muted)] md:text-lg">
              Install Blip, get your crew on it, and the mesh is already there when
              the bars disappear.
            </p>
            <Link
              href="/download"
              className="mt-9 inline-flex min-h-11 items-center rounded-full bg-[var(--accent)] px-8 text-base font-semibold text-white transition-colors duration-200 hover:bg-[var(--accent-light)]"
            >
              Get Blip
            </Link>
            <p className="mt-5 text-xs text-[var(--muted)]">
              iPhone only. Requires iOS 17 or later.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
