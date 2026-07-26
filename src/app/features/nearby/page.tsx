import type { Metadata } from "next";
import { SOCIAL_IMAGE } from "@/lib/seo";
import NearbyClient from "./NearbyClient";

const TITLE = "Find Your Friends at a Festival With No Signal";
const DESCRIPTION =
  "Find your friends at a festival with no signal. Blip shows who's nearby over Bluetooth mesh, maps your crew and shares meeting points. iPhone, no internet.";

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
      "Blip. It is an iPhone app built for exactly that: crowded events where reception dies. Friends show up in the Nearby tab over Bluetooth mesh, you can see them on a map, and you can drop a shared meeting point. Regular apps like Find My or WhatsApp need a working network. Blip does not.",
  },
  {
    question: "Does Blip track my location?",
    answer:
      "No. There is no Blip server watching where you are. Location sharing runs peer-to-peer over the mesh and you control it: the Profile screen has a location sharing setting scoped to friends only, plus a separate Nearby visibility toggle. Meeting point pins go only to the people you choose, and they expire on a timer you set.",
  },
  {
    question: "How accurate is the distance to a friend?",
    answer:
      "The metres next to a friend's name are an estimate, not a GPS fix. Bluetooth range shifts constantly at a packed event, because bodies, tents and structures all absorb signal. Read it as a guide: whether someone is beside you, across the field, or a few hops away. Use the friend map and a meeting point for the rest.",
  },
  {
    question: "Can I set a meeting point without signal?",
    answer:
      "Yes. Pick a spot — a gate, a stage, a food van — give it a label, choose who it goes to, and set how long it lasts. The pin travels to your crew over the mesh, the same way a message does. On the map it shows as a flagged pin with the time remaining, so nobody has to ask where again.",
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
