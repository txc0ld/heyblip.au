"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { ease } from "@/lib/animations";

type Faq = {
  question: string;
  answer: string;
};

type Section = {
  index: string;
  heading: string;
  body: string[];
  src: string;
  alt: string;
  caption: string;
};

const sections: Section[] = [
  {
    index: "01",
    heading: "Finding and joining an event before you lose signal",
    body: [
      "The Events tab lists what is on near you. Real dates, real venues, a cover image each — the screen here shows a food festival, a football match and a squash tournament all running across the same fortnight in WA.",
      "Join the one you are going to while you are still on data. That is the step that matters. Joining pulls the event onto your phone, so the details are already there when you walk through the gate and your bars disappear.",
    ],
    src: "/app-screens/01-events.png",
    alt: "Blip Events screen on iPhone listing upcoming events in WA — Plateful Perth, AC Milan v Inter, Gascoyne Food Festival and World Squash Masters — each with a cover image and dates.",
    caption: "Events tab — browse what is on, join before you travel.",
  },
  {
    index: "02",
    heading: "What the event page gives you on site",
    body: [
      "Once you have joined, the event gets its own page. The Perth Super 440 screen puts four things one tap away: event map, schedule, announcements, and lost and found — the four things people actually open in the middle of a crowd.",
      "Under those sits the next session up (Practice, Fri 10:20 AM) and the event chat channel with the number of people already in it. No feed to scroll. Just where to go and what is next.",
    ],
    src: "/app-screens/02-event-detail.png",
    alt: "Blip event page for Perth Super 440 at CARCO.com.au Raceway with tiles for Event map, Schedule, Announcements and Lost & Found, a next session card for Practice at 10:20 AM, and a Trackside Chat channel.",
    caption: "Event page — map, schedule, announcements, lost and found.",
  },
  {
    index: "03",
    heading: "Checking the schedule when there is no internet",
    body: [
      "The schedule view is per-day and filterable. Tabs across the top switch between days. Chips below narrow it to a zone — Track, Fan Zone, or all of it.",
      "Sessions list by time with the next one up highlighted and counting down. It reads from your phone, not from a server, so a dead network does not take the lineup with it. That is the difference between a festival schedule app and a web page you cannot load.",
    ],
    src: "/app-screens/03-schedule.png",
    alt: "Blip Schedule screen for Perth Super 440 with Saturday 1 August selected, Track and Fan Zone filters, and sessions listed at 9:10 Practice, 11:45 Qualifying starting in 15 minutes, 14:20 Top Ten Shootout and 16:05 Race 1.",
    caption: "Schedule — per-day, filterable, readable offline.",
  },
  {
    index: "04",
    heading: "How live event updates reach you with no reception",
    body: [
      "This is where the mesh earns it. Updates that go out during an event — a gate opening, trains running after the match, where the water stations are — travel phone to phone over Bluetooth Low Energy. Your iPhone picks one up from a nearby phone and passes it on to the next.",
      "The Event Updates screen stacks them in order, with a live crowd map and the event chat channels underneath. Nothing here needs Wi-Fi, mobile data, or event infrastructure. It needs other people with Blip running, which at a packed venue is not a hard ask.",
    ],
    src: "/app-screens/04-event-updates.png",
    alt: "Blip Event Updates screen for AC Milan v Inter at Optus Stadium showing updates for Gate D now open, trains running after the match and Level 1 water stations, a live Crowd Pulse stadium map, and Match Chat and Lost & Found channels.",
    caption: "Event Updates — announcements relayed through the crowd.",
  },
];

function ScreenShot({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div>
      <Image
        src={src}
        alt={alt}
        width={853}
        height={1844}
        priority={priority}
        sizes="(min-width: 1024px) 420px, (min-width: 640px) 55vw, 82vw"
        className="h-auto w-full"
      />
    </div>
  );
}

export default function EventsClient({ faqs }: { faqs: Faq[] }) {
  return (
    <main className="mesh-gradient relative overflow-hidden">
      <Nav />
      <Breadcrumb items={[{ label: "Features", href: "/features" }, { label: "Events" }]} />

      {/* Hero */}
      <section className="px-4 pb-16 pt-8 sm:px-6 md:pb-24 md:pt-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <p className="eyebrow mb-5">Events</p>
            <h1 className="mb-7 max-w-4xl text-4xl font-black leading-[0.94] tracking-[-0.045em] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Event schedules and updates that work without signal.
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-[var(--muted-strong)] sm:text-lg md:text-xl">
              Join the event in Blip before you arrive, while you still have reception. The
              schedule, lineup and event details download to your iPhone and stay there. Once you
              are on site, live updates and announcements travel phone-to-phone over Bluetooth
              mesh — so you keep up even when cellular and Wi-Fi have collapsed.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/download"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 text-base font-bold text-white shadow-[0_18px_50px_rgba(102,0,255,0.26)] transition-all duration-200 hover:bg-[var(--accent-light)]"
              >
                Get Blip
                <ArrowRight size={18} strokeWidth={1.8} />
              </Link>
              <p className="text-sm text-[var(--muted)] sm:ml-2">
                iPhone only. iOS 17 or newer.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subfunction sections */}
      {sections.map((section, i) => {
        const flip = i % 2 === 1;
        return (
          <section key={section.index} className="px-4 pb-16 sm:px-6 md:pb-24">
            <div className="mx-auto max-w-6xl">
              <div className="section-divider mb-12 md:mb-16" />

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease }}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div className={flip ? "lg:order-2" : undefined}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="text-[11px] font-bold tracking-[0.14em] text-[var(--accent-light)]">
                      {section.index}
                    </span>
                    <span className="signal-rule w-14" aria-hidden="true" />
                  </div>
                  <h2 className="mb-6 max-w-xl text-2xl font-bold leading-[1.1] tracking-[-0.03em] text-[var(--foreground)] sm:text-3xl md:text-4xl">
                    {section.heading}
                  </h2>
                  <div className="max-w-xl space-y-4">
                    {section.body.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 32)}
                        className="text-base leading-relaxed text-[var(--muted-strong)] sm:text-[17px]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className={flip ? "lg:order-1" : undefined}>
                  <div className="mx-auto w-full max-w-[340px] lg:max-w-[420px]">
                    <ScreenShot src={section.src} alt={section.alt} priority={i === 0} />
                    <p className="mt-4 border-t border-[var(--border)] pt-3 text-sm text-[var(--muted)]">
                      {section.caption}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        );
      })}

      {/* FAQ */}
      <section id="faq" className="px-4 pb-16 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="section-divider mb-12 md:mb-16" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease }}
            className="mb-10 md:mb-14"
          >
            <p className="eyebrow mb-4">Questions</p>
            <h2 className="text-2xl font-bold leading-[1.1] tracking-[-0.03em] text-[var(--foreground)] sm:text-3xl md:text-4xl">
              Schedules, updates and signal
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, ease, delay: index * 0.04 }}
                className="event-surface rounded-2xl p-5 md:p-7"
              >
                <h3 className="mb-3 text-base font-semibold text-[var(--foreground)] md:text-lg">
                  {faq.question}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--muted-strong)] md:text-[15px] md:leading-[1.7]">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-4 pb-20 sm:px-6 md:pb-28">
        <div className="mx-auto max-w-3xl">
          <div className="section-divider mb-12 md:mb-16" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease }}
            className="event-frame event-surface rounded-2xl p-8 text-center md:p-12"
          >
            <h2 className="mb-4 text-2xl font-bold leading-[1.1] tracking-[-0.03em] text-[var(--foreground)] sm:text-3xl">
              Set it up before the gates open.
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-[var(--muted-strong)]">
              Install Blip, join your event, and the schedule comes with you. Everything after that
              runs over the mesh.
            </p>
            <Link
              href="/download"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 text-base font-bold text-white shadow-[0_18px_50px_rgba(102,0,255,0.26)] transition-all duration-200 hover:bg-[var(--accent-light)]"
            >
              Get Blip
              <ArrowRight size={18} strokeWidth={1.8} />
            </Link>
            <p className="mt-5 text-sm text-[var(--muted)]">
              Running an event?{" "}
              <Link
                href="/organisers"
                className="text-[var(--muted-strong)] underline-offset-2 hover:text-[var(--foreground)] hover:underline"
              >
                Talk to us about event comms
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
