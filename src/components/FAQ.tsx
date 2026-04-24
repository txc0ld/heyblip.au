"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ease } from "@/lib/animations";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "What is the best way to communicate at a festival when there is no signal?",
    answer:
      "Bluetooth mesh chat apps like Blip are the most reliable way to communicate at festivals without mobile signal. They relay messages phone-to-phone through the crowd, so your text reaches your friend even when Wi-Fi and 4G/5G are unavailable. You do not need any extra hardware — just the app installed on an iPhone.",
  },
  {
    question: "How does a Bluetooth mesh chat app work?",
    answer:
      "A Bluetooth mesh chat app uses Bluetooth Low Energy to turn every nearby phone into a relay node. When you send a message, your phone broadcasts it to every phone around you running the same app. Those phones re-broadcast it to their neighbours, and so on — the message hops through the crowd until it reaches the recipient. Blip uses a 7-hop limit and adaptive gossip routing to cover roughly 200–300 metres through a dense crowd.",
  },
  {
    question: "Is there a messaging app that works offline without internet?",
    answer:
      "Yes. Blip is an iOS messaging app that works entirely offline using Bluetooth mesh networking. It does not require Wi-Fi, mobile data, or any server connection to send and receive messages between nearby users. Messages, voice notes, and photos all work the same way they do on a regular messenger — they just travel over Bluetooth instead of the internet.",
  },
  {
    question: "What app should I use to find my friends at a music festival?",
    answer:
      "Blip is built specifically for finding friends at music festivals. It shows you which friends are nearby, lets you send messages without signal, and includes a Friend Finder feature that shares approximate location with your crew. Because it uses Bluetooth mesh, it keeps working even when 100,000 people are crushing the mobile network.",
  },
  {
    question: "Is Blip free to use?",
    answer:
      "Yes. Blip is currently free to download from the App Store. There are no ads, no subscriptions required for core messaging features, and no paid tiers gating the essentials like text, voice notes, photos, or SOS alerts.",
  },
  {
    question: "Is Blip end-to-end encrypted?",
    answer:
      "Yes. Every direct message on Blip is end-to-end encrypted using the Noise protocol framework (Noise_XX_25519_ChaChaPoly_SHA256) with Ed25519 packet signing. The phones that relay your messages through the mesh cannot read them — only the intended recipient's device can decrypt the content.",
  },
  {
    question: "What phones does Blip work on?",
    answer:
      "Blip is iOS-only and requires an iPhone running iOS 17 or later with Bluetooth Low Energy 5.0 support (iPhone 8 and newer). An Android version is not available yet.",
  },
  {
    question: "What is the difference between Bluetooth mesh and LoRa mesh?",
    answer:
      "Bluetooth mesh uses the Bluetooth radio already built into every phone, so it works without extra hardware but has a shorter per-hop range of roughly 40 metres. LoRa mesh (used by projects like Meshtastic) requires dedicated long-range radio hardware and reaches several kilometres per hop. Blip uses Bluetooth mesh because it turns every festival-goer's phone into a node without anyone buying a device.",
  },
  {
    question: "Does Blip collect my location or personal data?",
    answer:
      "No. Blip does not collect precise GPS location, contacts, browsing history, or advertising identifiers. The only data stored server-side is your email, username, cryptographic public keys, and push notification token — the minimum required to deliver messages. Location is only shared with your friends during an active Friend Finder session and is not persisted on the server.",
  },
  {
    question: "Can Blip send an emergency SOS without signal?",
    answer:
      "Yes. Blip includes a dedicated Emergency SOS broadcast that reaches every nearby Blip user through the Bluetooth mesh. SOS packets relay at 100% probability (unlike regular messages, which throttle in dense crowds) and persist until resolved, so they propagate as far through the crowd as possible even when the mobile network has collapsed.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-16 md:py-24 px-4 sm:px-6">
      <div className="section-divider mb-12 md:mb-16" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease }}
          className="text-center mb-14 md:mb-20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gradient mb-6 md:mb-8">
            Frequently asked questions
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
            Everything you need to know about chatting at festivals without signal.
          </p>
        </motion.div>

        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, ease, delay: index * 0.04 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 md:px-7 md:py-6 transition-colors duration-200 hover:bg-[var(--card-bg-hover)]"
                >
                  <h3 className="text-base md:text-lg font-semibold text-[var(--foreground)]">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 text-[var(--muted)] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 md:px-7 md:pb-6 text-sm md:text-[15px] text-[var(--muted-strong)] leading-relaxed md:leading-[1.7]">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
