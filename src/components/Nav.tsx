"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/animations";
import { useTheme } from "./ThemeProvider";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Privacy", href: "#security" },
  { label: "Pricing", href: "#pricing" },
  { label: "Tech Specs", href: "/tech" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { resolved } = useTheme();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 md:py-4">
        <div className="glass rounded-2xl px-4 sm:px-5 md:px-8 py-2.5 sm:py-3 md:py-4 flex items-center justify-between">
          <a href="/" className="flex items-center group">
            <Image
              src={resolved === "light" ? "/Blipblacklogo.png" : "/Blipwhitelogo.png"}
              alt="Blip"
              width={160}
              height={64}
              className="h-10 sm:h-12 md:h-14 w-auto"
              priority
            />
          </a>

          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-px after:bg-[var(--foreground)] after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a
              href="#pricing"
              className="text-sm px-5 py-2.5 rounded-full bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-light)] transition-colors duration-200"
            >
              Get Blip
            </a>
          </div>

          {/* Mobile: just the hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>

        {/* Mobile menu — theme toggle lives here */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease }}
              className="md:hidden glass rounded-2xl mt-2 overflow-hidden"
            >
              <div className="p-5 flex flex-col gap-4">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-base text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}

                <div className="section-divider my-1" />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--muted)]">Theme</span>
                  <ThemeToggle />
                </div>

                <a
                  href="#pricing"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm px-5 py-2.5 rounded-full bg-[var(--accent)] text-white font-medium text-center mt-1"
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
