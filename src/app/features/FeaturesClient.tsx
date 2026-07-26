"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { childFadeUp, ease, stagger } from "@/lib/animations";

type Feature = {
  name: string;
  href: string;
  description: string;
};

const screens: Record<string, { src: string; alt: string }> = {
  "/features/chat": {
    src: "/app-screens/08-encrypted-chat.png",
    alt: "Blip end-to-end encrypted group chat still sending messages with no signal",
  },
  "/features/safety": {
    src: "/app-screens/11-medical-sos.png",
    alt: "Blip emergency SOS screen with hold-to-send medical alert",
  },
  "/features/events": {
    src: "/app-screens/01-events.png",
    alt: "Blip Events screen listing upcoming WA events to browse and join",
  },
  "/features/nearby": {
    src: "/app-screens/05-nearby.png",
    alt: "Blip Nearby screen showing friends detected nearby with distances",
  },
  "/features/profile": {
    src: "/app-screens/13-profile.png",
    alt: "Blip profile screen with location sharing and privacy controls",
  },
};

export default function FeaturesClient({ features }: { features: Feature[] }) {
  return (
    <main className="min-h-screen">
      <Nav />
      <Breadcrumb items={[{ label: "Features" }]} />

      <section className="px-4 pb-16 pt-10 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="max-w-3xl"
          >
            <motion.p
              variants={childFadeUp}
              transition={{ duration: 0.7, ease }}
              className="eyebrow mb-4"
            >
              Features
            </motion.p>
            <motion.h1
              variants={childFadeUp}
              transition={{ duration: 0.7, ease }}
              className="text-4xl font-black leading-[0.92] tracking-[-0.045em] text-[var(--foreground)] sm:text-5xl md:text-6xl"
            >
              Everything Blip does when the network doesn&apos;t.
            </motion.h1>
            <motion.p
              variants={childFadeUp}
              transition={{ duration: 0.7, ease }}
              className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--muted-strong)] sm:text-lg"
            >
              Blip relays messages phone-to-phone over encrypted Bluetooth mesh, so
              chat, SOS, schedules, and friend-finding keep working at events where
              Wi-Fi and mobile data collapse. No internet, no accounts tied to a
              phone number — just your crew, reachable.
            </motion.p>
          </motion.div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const screen = screens[feature.href];
              return (
                <motion.div
                  key={feature.href}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, ease, delay: (index % 3) * 0.08 }}
                >
                  <Link
                    href={feature.href}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] transition-colors duration-200 hover:border-[var(--accent)]/50"
                  >
                    {screen && (
                      <div className="relative aspect-[4/3] overflow-hidden bg-black">
                        <Image
                          src={screen.src}
                          alt={screen.alt}
                          fill
                          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-bold text-[var(--foreground)]">
                          {feature.name}
                        </h2>
                        <ArrowRight
                          size={18}
                          strokeWidth={1.8}
                          className="shrink-0 text-[var(--muted)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--accent-light)]"
                        />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                        {feature.description}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease, delay: 0.16 }}
            >
              <div className="flex h-full flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 md:p-6">
                <div>
                  <h2 className="text-lg font-bold text-[var(--foreground)]">
                    How it all works
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                    BLE 5.0 mesh, Noise XX + Ed25519 encryption, adaptive gossip
                    routing, and a 7-hop TTL. The full protocol is documented on
                    the tech page.
                  </p>
                </div>
                <div className="mt-6 flex flex-col gap-3">
                  <Link
                    href="/tech"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border-strong)] px-5 text-sm font-semibold text-[var(--foreground)] transition-all duration-200 hover:border-[var(--accent)]/50"
                  >
                    Read the tech specs
                  </Link>
                  <Link
                    href="/download"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--accent-light)]"
                  >
                    Get Blip for iPhone
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
