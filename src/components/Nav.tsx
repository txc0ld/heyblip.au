"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/animations";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center glow-accent-sm transition-shadow group-hover:shadow-[0_0_40px_var(--accent-glow-strong)]">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3" fill="white" />
                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">Blip</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--muted-strong)] hover:text-white transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#pricing"
              className="text-sm px-5 py-2 rounded-full bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-light)] transition-colors duration-200"
            >
              Get Blip
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[var(--muted)]"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease }}
              className="md:hidden glass rounded-2xl mt-2 overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-4">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base text-[var(--muted-strong)] hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#pricing"
                  className="text-sm px-5 py-2.5 rounded-full bg-[var(--accent)] text-white font-medium text-center mt-2"
                >
                  Get Blip
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
