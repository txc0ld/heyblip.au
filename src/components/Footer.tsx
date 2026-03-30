export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-md bg-[var(--accent)] flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="3" fill="white" />
                  <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>
              </div>
              <span className="text-base font-bold">Blip</span>
            </div>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              Bluetooth mesh chat for festivals. Made in Australia.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--muted)] font-medium mb-4">
              Product
            </p>
            <ul className="space-y-2.5">
              <li><a href="#features" className="text-sm text-[var(--muted-strong)] hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm text-[var(--muted-strong)] hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#security" className="text-sm text-[var(--muted-strong)] hover:text-white transition-colors">Security</a></li>
              <li><a href="#how-it-works" className="text-sm text-[var(--muted-strong)] hover:text-white transition-colors">How it Works</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--muted)] font-medium mb-4">
              Legal
            </p>
            <ul className="space-y-2.5">
              <li><a href="/privacy" className="text-sm text-[var(--muted-strong)] hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="text-sm text-[var(--muted-strong)] hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--muted)] font-medium mb-4">
              Connect
            </p>
            <ul className="space-y-2.5">
              <li><a href="https://github.com/txc0ld/FezChat" className="text-sm text-[var(--muted-strong)] hover:text-white transition-colors">GitHub</a></li>
              <li><a href="mailto:hello@heyblip.au" className="text-sm text-[var(--muted-strong)] hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="section-divider mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--muted)]">
            &copy; {new Date().getFullYear()} Blip. All rights reserved.
          </p>
          <p className="text-xs text-[var(--muted)]">
            ABN placeholder &middot; Sydney, Australia
          </p>
        </div>
      </div>
    </footer>
  );
}
