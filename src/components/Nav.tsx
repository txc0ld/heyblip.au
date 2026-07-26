"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/animations";
import { useTheme } from "./ThemeProvider";

const featureLinks = [
  { label: "Chat", href: "/features/chat" },
  { label: "Safety & SOS", href: "/features/safety" },
  { label: "Events", href: "/features/events" },
  { label: "Nearby & friends", href: "/features/nearby" },
  { label: "Profile", href: "/features/profile" },
];

const links = [
  { label: "Download", href: "/download" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "For organisers", href: "/organisers" },
  { label: "Tech & privacy", href: "/tech" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const { resolved } = useTheme();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 md:py-4">
        <div className="event-surface rounded-xl px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center group" aria-label="Blip home">
            <Image
              src={resolved === "light" ? "/Blipblacklogo.png" : "/Blipwhitelogo.png"}
              alt="Blip"
              width={320}
              height={128}
              className="h-14 sm:h-16 md:h-20 w-auto"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            <div
              className="relative"
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                aria-expanded={featuresOpen}
                aria-haspopup="true"
                className="flex items-center gap-1 text-sm text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200"
              >
                Features
                <ChevronDown
                  size={14}
                  strokeWidth={1.5}
                  className={`transition-transform duration-200 ${featuresOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {featuresOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18, ease }}
                    className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
                  >
                    <div className="event-surface w-52 rounded-xl p-2">
                      {featureLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setFeaturesOpen(false)}
                          className="block rounded-lg px-3 py-2 text-sm text-[var(--muted-strong)] transition-colors duration-200 hover:bg-[var(--foreground)]/[0.06] hover:text-[var(--foreground)]"
                        >
                          {link.label}
                        </Link>
                      ))}
                      <div className="section-divider my-1.5" />
                      <Link
                        href="/features"
                        onClick={() => setFeaturesOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm font-semibold text-[var(--foreground)] transition-colors duration-200 hover:bg-[var(--foreground)]/[0.06]"
                      >
                        All features
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[var(--foreground)] after:transition-all after:duration-200 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/download"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[var(--accent-light)]"
            >
              Get Blip
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/download"
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--accent)] px-4 text-sm font-bold text-white transition-all duration-200"
            >
              Download
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex min-h-10 min-w-10 items-center justify-center text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease }}
              className="event-surface mt-2 overflow-hidden rounded-2xl md:hidden"
            >
              <div className="p-5 flex flex-col gap-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">
                  Features
                </p>
                {featureLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="pl-3 text-base text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="section-divider my-1" />

                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="section-divider my-1" />

                <Link
                  href="/download"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-center text-sm font-medium text-white transition-all duration-200"
                >
                  Get Blip
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
