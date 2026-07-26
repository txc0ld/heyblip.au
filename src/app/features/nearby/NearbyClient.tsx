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
    <div className="mx-auto w-full max-w-[320px]">
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
  { label: "Discovery", value: "Bluetooth Low Energy 5.0+" },
  { label: "Range per hop", value: "~40m, up to 100m line-of-sight" },
  { label: "Relay depth", value: "Up to 7 hops" },
  { label: "Location sharing", value: "Friends only, you control it" },
];

const sections = [
  {
    id: "who-is-nearby",
    eyebrow: "People nearby",
    heading: "See who's nearby when there's no reception",
    body: [
      "The Nearby tab is the first place you look when the bars die. It counts the people around you running Blip, then lists your friends with a rough distance beside each name — nearby, 12 m, 28 m — so you know who is within reach before you start walking.",
      "People you have not added show up too, with an Add Friend button next to them. That is how a crew grows mid-event without swapping numbers. Underneath, a venue card shows where you are and how many people are on the mesh there.",
      "All of it comes over Bluetooth mesh. No tower, no Wi-Fi, no check-in to a server.",
    ],
    shot: {
      src: "/app-screens/05-nearby.png",
      alt: "Blip Nearby screen showing 4 people nearby, a list with Maya nearby, Jake at 12 m and Priya at 28 m, Theo marked not a friend with an Add Friend button, and an Optus Stadium card reading 126 nearby",
      caption:
        "A live count at the top, friends with rough distances, an Add Friend button for people you have not added yet, and the venue you are standing in.",
    },
    priority: true,
  },
  {
    id: "friend-map",
    eyebrow: "Friend map",
    heading: "Find my friends without internet — on a live event map",
    body: [
      "Find Friends puts your crew on a map of the venue you are at. Each pin carries a name and how far away they are, or how long it takes to walk there. The event and date sit in the header, so there is no guessing which map you are looking at.",
      "One tap on I'm here pushes your position to the people you have chosen to share with. The control at the bottom of the screen says exactly who that is — Friends only — and it stays where you can see it rather than buried in settings.",
      "Nothing here routes through a Blip server. Positions travel the same encrypted path your messages take: phone to phone, hop by hop, through the crowd.",
    ],
    shot: {
      src: "/app-screens/06-friend-map.png",
      alt: "Blip Find Friends map for AC Milan v Inter at Optus Stadium with pins for Maya at 35 m, Jake nearby and Priya 2 min away, a Gate D meeting point with 45 min left, an I'm here button and a Friends only sharing control",
      caption:
        "Friend pins with distance or walking time, the crew's Gate D meeting point on the map, an I'm here button, and sharing scoped to Friends only.",
    },
    priority: false,
  },
  {
    id: "meeting-point",
    eyebrow: "Meeting points",
    heading: "Set a meeting point your crew can actually find",
    body: [
      "Splitting up is fine as long as everyone knows where to come back to. Drop a pin on a gate, a stage or a food van, give it a label, choose who it goes to, and set how long it lasts — 45 minutes, or whatever fits the set times.",
      "The pin relays to your crew over the mesh exactly like a message does, then shows on their map with the time remaining on it. The sheet tells you the venue and the location accuracy your phone reported, and states plainly that only selected friends can see the pin.",
    ],
    shot: {
      src: "/app-screens/14-meeting-point.png",
      alt: "Blip Create meeting point sheet over a stadium map with a Gate D pin, fields for Label Gate D, Share with Festival Crew and Expires in 45 minutes, a Share meeting point button, and a note that only selected friends can see this pin",
      caption:
        "Label the pin, pick who it goes to, give it an expiry. The venue and reported accuracy sit under the fields, above the sharing note.",
    },
    priority: false,
  },
  {
    id: "network-status",
    eyebrow: "Mesh status",
    heading: "Mesh network status: how connected you actually are",
    body: [
      "Before you split up, it helps to know the mesh is healthy. The Network screen says whether the mesh is active, how many peers are around you, and how Blip is behaving right now — messages prioritised, battery mode set for the whole day, connection over Bluetooth mesh.",
      "The node graph makes the shape of it obvious: you in the middle of a nearby cluster, and the bridge phones that link your cluster to the rest of the crowd. Those bridges are why someone three hops away still gets your message.",
      "Density modes step up from Gather to Massive, so the app can behave differently in a pub-sized crowd and in a stadium.",
    ],
    shot: {
      src: "/app-screens/15-network-status.png",
      alt: "Blip Network screen showing Mesh active, 47 peers nearby, messages prioritised, all-day battery mode, connection over Bluetooth mesh, a node graph with You inside a nearby cluster and two bridge nodes, and density modes from Gather to Massive",
      caption:
        "Mesh active, 47 peers nearby, and a node graph showing your nearby cluster plus the bridge phones linking it to the wider crowd.",
    },
    priority: false,
  },
];

const controlPoints = [
  {
    title: "Location sharing, scoped",
    text: "The Profile screen carries a location sharing setting. Set to friends only, it means friends only.",
  },
  {
    title: "Nearby visibility toggle",
    text: "A separate switch decides whether you show up in other people's Nearby list at all.",
  },
  {
    title: "Pins that run out",
    text: "A meeting point goes to the people you pick and expires on the timer you set when you shared it.",
  },
];

export default function NearbyClient({ faqs }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="mesh-gradient relative overflow-hidden">
      <Nav />
      <Breadcrumb items={[{ label: "Features", href: "/features" }, { label: "Nearby" }]} />

      {/* Hero */}
      <section className="px-6 pt-8 pb-16 md:pt-10 md:pb-24">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="eyebrow mb-4">Nearby</p>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Find your friends at a festival with no signal
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted-strong)] md:text-xl md:leading-[1.7]">
              You find your friends at a festival with no signal by using an app
              that skips the network entirely. Blip&apos;s Nearby tab shows which
              friends are within Bluetooth range and roughly how far away they
              are, plots them on a friend map, and lets you drop a meeting point
              your whole crew can walk to.
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

      {/* Location controls */}
      <section id="location-controls" className="px-6 py-14 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="section-divider mb-14 md:mb-20" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="eyebrow mb-4">Your controls</p>
            <h2 className="max-w-3xl text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl md:text-4xl">
              Who can see you is your decision, not ours
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted-strong)] md:text-[17px] md:leading-[1.75]">
              A friend finder app with no signal only earns its place if the
              sharing is honest. Blip has no server collecting your position, so
              there is nothing central to track. What is shared travels
              peer-to-peer over the mesh, to the people you chose.
            </p>

            <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] md:grid-cols-3">
              {controlPoints.map((point) => (
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
            Finding your crew, answered straight
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
              Get everyone on Blip before you walk in
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-[var(--muted)] md:text-lg">
              The mesh only finds phones that are running it. Install Blip, add
              your crew, and the Nearby tab is already working when the signal
              goes.
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
