import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-12 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-8 md:gap-10 mb-12 sm:mb-16">
          <div>
            <div className="mb-4">
              <Image
                src="/logo-white.png"
                alt="Blip"
                width={72}
                height={28}
                className="h-6 w-auto dark:block hidden"
              />
              <Image
                src="/logo-dark.png"
                alt="Blip"
                width={72}
                height={28}
                className="h-6 w-auto dark:hidden block"
              />
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Bluetooth mesh chat for festivals. Made in Australia.
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--muted)] font-medium mb-3 sm:mb-4">
              Product
            </p>
            <ul className="space-y-2 sm:space-y-2.5">
              <li><a href="#features" className="text-sm text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors">Pricing</a></li>
              <li><a href="#security" className="text-sm text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors">Privacy</a></li>
              <li><a href="/tech" className="text-sm text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors">Tech Specs</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--muted)] font-medium mb-3 sm:mb-4">
              Legal
            </p>
            <ul className="space-y-2 sm:space-y-2.5">
              <li><a href="/privacy" className="text-sm text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-sm text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--muted)] font-medium mb-3 sm:mb-4">
              Connect
            </p>
            <ul className="space-y-2 sm:space-y-2.5">
              <li><a href="https://github.com/txc0ld/FezChat" className="text-sm text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors">GitHub</a></li>
              <li><a href="mailto:hello@heyblip.au" className="text-sm text-[var(--muted-strong)] hover:text-[var(--foreground)] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="section-divider mb-6 sm:mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs text-[var(--muted)]">
            &copy; {new Date().getFullYear()} Blip. All rights reserved.
          </p>
          <p className="text-xs text-[var(--muted)]">
            Sydney, Australia
          </p>
        </div>
      </div>
    </footer>
  );
}
