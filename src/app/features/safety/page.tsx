import type { Metadata } from "next";
import { SOCIAL_IMAGE } from "@/lib/seo";
import SafetyClient, { type FaqItem } from "./SafetyClient";

const TITLE = "Festival Safety & Emergency SOS With No Signal";
const DESCRIPTION =
  "Blip's Emergency SOS broadcasts over Bluetooth mesh to every nearby Blip phone when there's no reception. It alerts people around you — it doesn't call 000.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/features/safety" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/features/safety",
    type: "article",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [SOCIAL_IMAGE],
  },
};

const faqs: FaqItem[] = [
  {
    question: "Does Blip's SOS call Triple Zero (000)?",
    answer:
      "No. Blip has no connection to emergency services. An SOS broadcasts over Bluetooth mesh to nearby phones running Blip, so people around you know you need help and where you are. Always call 000 if you can. Use Blip when the network is down, or as well as calling.",
  },
  {
    question: "Who sees my SOS?",
    answer:
      "Every Blip user within mesh range at your event. The alert hops phone to phone, so it reaches people you have never met, not just your crew. It carries the severity you picked and your approximate zone. If your event runs a Blip-equipped medical team, they see it too.",
  },
  {
    question: "Does SOS work with no reception at all?",
    answer:
      "Yes. SOS never touches a mobile tower, Wi-Fi, or a server. It travels over Bluetooth Low Energy between phones, up to seven hops. Range depends on how many people nearby have Blip open with Bluetooth on — roughly 200 to 300 metres through a dense crowd.",
  },
  {
    question: "Why does an SOS get through when a normal message might not?",
    answer:
      "In big crowds Blip throttles ordinary message relaying to keep the mesh stable — down to about 20% relay probability above 60 peers. SOS is exempt. Every phone that receives one relays it, and phones hold it in store-and-forward until it is resolved, so it keeps spreading.",
  },
  {
    question: "Can I send an SOS by accident?",
    answer:
      "It takes a deliberate two-second hold, with a ring that fills as you press. The same screen carries a severity selector — green minor, amber moderate, or red severe — and a Cancel button, so a pocket tap will not fire an alert across the event.",
  },
  {
    question: "Is my location shared when I send an SOS?",
    answer:
      "Yes, approximately. The SOS screen shows the zone that will travel with your alert, plus an accuracy readout, so responders know roughly where to look. Outside an SOS or an active Friend Finder session, your location is not shared with anyone or stored on a server.",
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

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SafetyClient faqs={faqs} />
    </>
  );
}
