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
            <div className="mb-5">
              <Image
                src={resolved === "light" ? "/Blipblacklogo.png" : "/Blipwhitelogo.png"}
                alt="Blip"
                width={80}
                height={32}
                className="h-7 md:h-8 w-auto"
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
              <li><a href="#features" className="text-sm md:text-[15px] text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200">Features</a></li>
              <li><a href="#pricing" className="text-sm md:text-[15px] text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200">Pricing</a></li>
              <li><a href="#security" className="text-sm md:text-[15px] text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200">Privacy</a></li>
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
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)] font-semibold mb-4 md:mb-5">
              Connect
            </p>
            <ul className="space-y-2.5 md:space-y-3">
              <li><a href="https://github.com/txc0ld/FezChat" className="text-sm md:text-[15px] text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200">GitHub</a></li>
              <li><a href="mailto:hello@heyblip.au" className="text-sm md:text-[15px] text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors duration-200">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="section-divider mb-8 md:mb-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs md:text-sm text-[var(--muted)]">
            &copy; {new Date().getFullYear()} Blip. All rights reserved.
          </p>
          <p className="text-xs md:text-sm text-[var(--muted)]">
            Sydney, Australia
          </p>
        </div>
      </div>
    </footer>
  );
}
