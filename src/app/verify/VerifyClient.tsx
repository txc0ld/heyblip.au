"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Clock, X, ShieldCheck, Loader2 } from "lucide-react";
import { ease } from "@/lib/animations";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

type Status = "success" | "expired" | "invalid" | "already-verified" | "pending";

const KNOWN_STATUSES: readonly Status[] = [
  "success",
  "expired",
  "invalid",
  "already-verified",
  "pending",
];

function toStatus(raw: string | null): Status {
  if (!raw) return "pending";
  return (KNOWN_STATUSES as readonly string[]).includes(raw)
    ? (raw as Status)
    : "invalid";
}

const content: Record<
  Status,
  {
    icon: typeof Check;
    iconClass: string;
    title: string;
    body: string;
    primaryCta: { label: string; href: string } | null;
    secondaryCta: { label: string; href: string } | null;
  }
> = {
  pending: {
    icon: Loader2,
    iconClass: "text-[var(--muted)] animate-spin",
    title: "Verifying your email…",
    body: "Hang tight. If this screen doesn't change in a moment, your link may be malformed — check the email you received and try again.",
    primaryCta: null,
    secondaryCta: { label: "Back to home", href: "/" },
  },
  success: {
    icon: Check,
    iconClass: "text-[var(--accent-light)]",
    title: "Email verified.",
    body: "You're all set. Open Blip on your iPhone to finish setting up your account and start chatting on the mesh.",
    primaryCta: { label: "Open Blip", href: "https://apps.apple.com/app/blip" },
    secondaryCta: { label: "Back to home", href: "/" },
  },
  "already-verified": {
    icon: ShieldCheck,
    iconClass: "text-[var(--accent-light)]",
    title: "Already verified.",
    body: "This email is already confirmed on a Blip account. You can open the app and log in — no further action required.",
    primaryCta: { label: "Open Blip", href: "https://apps.apple.com/app/blip" },
    secondaryCta: { label: "Back to home", href: "/" },
  },
  expired: {
    icon: Clock,
    iconClass: "text-[var(--muted-strong)]",
    title: "This link has expired.",
    body: "Verification links expire after 24 hours for your security. Open Blip and request a new verification email from the sign-up screen.",
    primaryCta: { label: "Open Blip", href: "https://apps.apple.com/app/blip" },
    secondaryCta: { label: "Contact support", href: "mailto:support@heyblip.au" },
  },
  invalid: {
    icon: X,
    iconClass: "text-[var(--muted-strong)]",
    title: "We couldn't verify this link.",
    body: "The link may be incomplete, already used, or malformed. Open Blip and request a fresh verification email, or get in touch if this keeps happening.",
    primaryCta: { label: "Open Blip", href: "https://apps.apple.com/app/blip" },
    secondaryCta: { label: "Contact support", href: "mailto:support@heyblip.au" },
  },
};

export default function VerifyClient() {
  const params = useSearchParams();
  const status = toStatus(params.get("status"));
  const state = content[status];
  const Icon = state.icon;

  return (
    <main className="mesh-gradient relative overflow-hidden min-h-screen flex flex-col">
      <Nav />

      <section
        className="flex-1 flex items-center justify-center px-4 sm:px-6 py-24 md:py-32"
        aria-live="polite"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="w-full max-w-md"
        >
          <div className="glass rounded-3xl p-8 sm:p-10 md:p-12 text-center">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center"
              aria-hidden="true"
            >
              <Icon size={32} strokeWidth={1.75} className={state.iconClass} />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gradient mb-4 sm:mb-5">
              {state.title}
            </h1>

            <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed md:leading-[1.7] mb-8 sm:mb-10">
              {state.body}
            </p>

            <div className="flex flex-col gap-3">
              {state.primaryCta && (
                <a
                  href={state.primaryCta.href}
                  className="w-full px-8 py-3 md:py-3.5 rounded-full bg-[var(--accent)] text-white font-semibold text-sm sm:text-base hover:bg-[var(--accent-light)] transition-all duration-200 glow-accent-sm hover:glow-accent hover:scale-[1.02]"
                >
                  {state.primaryCta.label}
                </a>
              )}
              {state.secondaryCta && (
                <a
                  href={state.secondaryCta.href}
                  className="w-full px-8 py-3 md:py-3.5 rounded-full border border-[var(--border-strong)] text-[var(--muted-strong)] font-medium text-sm sm:text-base hover:text-[var(--foreground)] hover:border-[var(--muted)] transition-all duration-200"
                >
                  {state.secondaryCta.label}
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
