import type { Metadata } from "next";
import { SOCIAL_IMAGE } from "@/lib/seo";
import NearbyClient from "./NearbyClient";

const TITLE = "Find Your Friends at a Festival With No Signal";
const DESCRIPTION =
  "Find your friends at a festival with no signal. Blip shows who's nearby over Bluetooth mesh and maps your crew. iPhone, no internet.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/features/nearby" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/features/nearby",
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

const faqs = [
  {
    question: "How do I find my friends at a festival with no reception?",
    answer:
      "Open the Nearby tab. Blip lists the friends your phone can reach over Bluetooth mesh, with a rough distance next to each name. Tap through to the friend map to see where they sit relative to you and the venue. None of it needs Wi-Fi, mobile data or a tower — only other phones running Blip.",
  },
  {
    question: "What app should I use to find my friends at a music festival?",
    answer:
      "Blip. It is an iPhone app built for exactly that: crowded events where reception dies. Friends show up in the Nearby tab over Bluetooth mesh and you can see them on a map; meeting points are not in the shipped app yet. Regular apps like Find My or WhatsApp need a working network. Blip does not.",
  },
  {
    question: "Does Blip track my location?",
    answer:
      "Blip keeps no database of where you are. When you switch on sharing, your position travels over the mesh as a signed, unencrypted packet that any nearby Blip phone can receive, and through our relay when a phone has internet; the relay forwards it and does not keep it. You control it from the Share location button on the Nearby map, and a separate Nearby visibility toggle controls whether your presence announcement, which carries a 5-character geohash, goes out at all.",
  },
  {
    question: "How accurate is the distance to a friend?",
    answer:
      "The metres next to a friend's name are an estimate, not a GPS fix. Bluetooth range shifts constantly at a packed event, because bodies, tents and structures all absorb signal. Read it as a guide: whether someone is beside you, across the field, or a few hops away. Use the friend map for the rest.",
  },
  {
    question: "Can I set a meeting point without signal?",
    answer:
      "Not in the current build. Meeting points are coded but held back; when they ship, a pin will carry a label and an expiry timer.",
  },
  {
    question: "How far away can Blip find a friend?",
    answer:
      "Each Bluetooth Low Energy hop covers roughly 40 metres, and up to about 100 metres line-of-sight. Blip relays up to seven hops, so practical reach through a crowd lands around 200 to 300 metres. Density helps: the more phones running Blip between you and your mate, the further the mesh stretches.",
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
      <NearbyClient faqs={faqs} />
    </>
  );
}
