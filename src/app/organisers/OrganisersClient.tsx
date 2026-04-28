"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { ease } from "@/lib/animations";
import Nav from "@/components/Nav";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { submitOrganiserApplication, type OrganiserFormState } from "./actions";

const EVENT_TYPES = [
  "Festival",
  "Concert",
  "Sporting event",
  "Ultra marathon",
  "Conference",
  "Other",
];

const initialState: OrganiserFormState = { ok: false };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto px-10 py-3.5 md:px-12 md:py-4 rounded-full bg-[var(--accent)] text-white font-semibold text-base hover:bg-[var(--accent-light)] transition-all duration-200 glow-accent-sm hover:glow-accent hover:scale-[1.02] disabled:opacity-60 disabled:pointer-events-none"
    >
      {pending ? "Sending…" : "Submit application"}
    </button>
  );
}

const INPUT =
  "w-full rounded-xl bg-[var(--glass)] border border-[var(--glass-border)] px-4 py-3 text-[15px] text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)]/60 focus:ring-2 focus:ring-[var(--accent)]/20 transition-all duration-150";

const LABEL =
  "block text-sm font-medium text-[var(--muted-strong)] mb-2";

const ERROR_TEXT = "mt-1.5 text-xs text-red-400";

export default function OrganisersClient() {
  const [state, formAction] = useActionState(submitOrganiserApplication, initialState);

  useEffect(() => {
    if (state.ok) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [state.ok]);

  return (
    <main className="mesh-gradient relative overflow-hidden">
      <Nav />
      <Breadcrumb showHome={false} items={[{ label: "For Organisers" }]} />

      <section className="pt-8 md:pt-12 pb-20 md:pb-28 px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent-light)] font-semibold mb-4">
              For Organisers
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gradient mb-6">
              Host Blip at your event.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
              Tell us about your event and we&apos;ll be in touch about onboarding,
              stage channels, announcements, and medical SOS integration.
            </p>
          </div>

          {state.ok ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="glass-strong rounded-3xl p-8 md:p-12 text-center border border-[var(--accent)]/30"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--accent)]/15 mb-5">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[var(--accent-light)]">
                  <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] mb-3">
                Thanks — we&apos;ve got it.
              </h2>
              <p className="text-[var(--muted)] text-base leading-relaxed max-w-md mx-auto">
                We&apos;ll reply within a few business days from <span className="text-[var(--foreground)]">hello@heyblip.au</span>.
                Keep an eye on your spam folder just in case.
              </p>
            </motion.div>
          ) : (
            <form action={formAction} className="glass rounded-3xl p-6 sm:p-8 md:p-10 space-y-6 md:space-y-7">
              {/* Honeypot — hidden from real users */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
                <label>
                  Company name
                  <input type="text" name="companyName" tabIndex={-1} autoComplete="off" />
                </label>
              </div>

              {state.error && (
                <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {state.error}
                </div>
              )}

              <div>
                <label htmlFor="eventName" className={LABEL}>Event name</label>
                <input id="eventName" name="eventName" type="text" className={INPUT} placeholder="Example Festival 2026" />
                {state.fieldErrors?.eventName && <p className={ERROR_TEXT}>{state.fieldErrors.eventName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label htmlFor="eventType" className={LABEL}>Event type</label>
                  <select id="eventType" name="eventType" defaultValue="" className={INPUT}>
                    <option value="" disabled>Select…</option>
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {state.fieldErrors?.eventType && <p className={ERROR_TEXT}>{state.fieldErrors.eventType}</p>}
                </div>

                <div>
                  <label htmlFor="eventDate" className={LABEL}>Date or date range</label>
                  <input id="eventDate" name="eventDate" type="text" className={INPUT} placeholder="e.g. 12–14 March 2027" />
                  {state.fieldErrors?.eventDate && <p className={ERROR_TEXT}>{state.fieldErrors.eventDate}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="venue" className={LABEL}>
                  Venue <span className="text-[var(--muted)] font-normal">(optional)</span>
                </label>
                <input id="venue" name="venue" type="text" className={INPUT} placeholder="Venue or site name" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label htmlFor="city" className={LABEL}>City</label>
                  <input id="city" name="city" type="text" className={INPUT} placeholder="Melbourne" />
                  {state.fieldErrors?.city && <p className={ERROR_TEXT}>{state.fieldErrors.city}</p>}
                </div>
                <div>
                  <label htmlFor="country" className={LABEL}>Country</label>
                  <input id="country" name="country" type="text" className={INPUT} placeholder="Australia" />
                  {state.fieldErrors?.country && <p className={ERROR_TEXT}>{state.fieldErrors.country}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="expectedAttendance" className={LABEL}>Expected attendance</label>
                <input id="expectedAttendance" name="expectedAttendance" type="text" className={INPUT} placeholder="e.g. 25,000" />
                {state.fieldErrors?.expectedAttendance && <p className={ERROR_TEXT}>{state.fieldErrors.expectedAttendance}</p>}
              </div>

              <div className="section-divider" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label htmlFor="organiserName" className={LABEL}>Your name</label>
                  <input id="organiserName" name="organiserName" type="text" className={INPUT} placeholder="Jane Doe" autoComplete="name" />
                  {state.fieldErrors?.organiserName && <p className={ERROR_TEXT}>{state.fieldErrors.organiserName}</p>}
                </div>
                <div>
                  <label htmlFor="email" className={LABEL}>Email</label>
                  <input id="email" name="email" type="email" className={INPUT} placeholder="jane@example.com" autoComplete="email" />
                  {state.fieldErrors?.email && <p className={ERROR_TEXT}>{state.fieldErrors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label htmlFor="phone" className={LABEL}>
                    Phone <span className="text-[var(--muted)] font-normal">(optional)</span>
                  </label>
                  <input id="phone" name="phone" type="tel" className={INPUT} placeholder="+61 …" autoComplete="tel" />
                </div>
                <div>
                  <label htmlFor="website" className={LABEL}>
                    Website or socials <span className="text-[var(--muted)] font-normal">(optional)</span>
                  </label>
                  <input id="website" name="website" type="text" className={INPUT} placeholder="yourevent.com / @handle" />
                </div>
              </div>

              <div>
                <label htmlFor="description" className={LABEL}>About the event</label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  className={INPUT}
                  placeholder="What's the event, what you're hoping Blip can do for it, and anything else we should know."
                />
                {state.fieldErrors?.description && <p className={ERROR_TEXT}>{state.fieldErrors.description}</p>}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-xs text-[var(--muted)] text-center sm:text-left">
                  We&apos;ll only use this to reply about hosting Blip at your event.
                </p>
                <SubmitButton />
              </div>
            </form>
          )}
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}
