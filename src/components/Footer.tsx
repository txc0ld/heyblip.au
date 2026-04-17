"use client";

import Image from "next/image";
import { useTheme } from "./ThemeProvider";

export default function Footer() {
  const { resolved } = useTheme();

  return (
    <footer className="border-t border-[var(--border)] py-14 sm:py-16 md:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 lg:gap-14 mb-14 md:mb-20">
          <div>
            <div className="mb-6">
              <Image
                src={resolved === "light" ? "/Blipblacklogo.png" : "/Blipwhitelogo.png"}
                alt="Blip"
                width={200}
                height={80}
                className="h-12 md:h-14 w-auto"
              />
            </div>
            <p className="text-sm md:text-[15px] text-[var(--muted)] leading-relaxed md:leading-[1.7]">
              Bluetooth mesh chat for festivals. Made in Australia.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)] font-semibold mb-4 md:mb-5">
              Product
            </p>
            <ul className="space-y-2.5 md:space-y-3">
              <li><a href="/#features" className="text-sm md:text-[15px] text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200">Features</a></li>
              <li><a href="/#how-it-works" className="text-sm md:text-[15px] text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200">How it Works</a></li>
              <li><a href="/#pricing" className="text-sm md:text-[15px] text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200">Pricing</a></li>
              <li><a href="/tech" className="text-sm md:text-[15px] text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200">Tech Specs</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)] font-semibold mb-4 md:mb-5">
              Legal
            </p>
            <ul className="space-y-2.5 md:space-y-3">
              <li><a href="/privacy" className="text-sm md:text-[15px] text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="/terms" className="text-sm md:text-[15px] text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200">Terms of Service</a></li>
              <li><a href="/acceptable-use" className="text-sm md:text-[15px] text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200">Acceptable Use</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)] font-semibold mb-4 md:mb-5">
              Support
            </p>
            <ul className="space-y-2.5 md:space-y-3">
              <li><a href="mailto:hello@heyblip.au" className="text-sm md:text-[15px] text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200">Contact Us</a></li>
              <li><a href="mailto:support@heyblip.au" className="text-sm md:text-[15px] text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200">Help & Support</a></li>
              <li>
                <a
                  href="https://github.com/txc0ld/heyblip"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm md:text-[15px] text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200 inline-flex items-center gap-1.5"
                >
                  GitHub
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="opacity-60">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="section-divider mb-8 md:mb-10" />

        <div className="text-center">
          <p className="text-xs md:text-sm text-[var(--muted)]">
            &copy; {new Date().getFullYear()} Blip. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
