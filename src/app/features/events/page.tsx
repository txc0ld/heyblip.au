import type { Metadata } from "next";
import { SOCIAL_IMAGE } from "@/lib/seo";
import EventsClient from "./EventsClient";

const TITLE = "Festival Schedule & Event Updates Offline";
const DESCRIPTION =
  "Join the event before you arrive and the schedule stays on your phone. Blip relays live event updates over Bluetooth mesh at festivals, races and concerts.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/features/events" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/features/events",
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

const FAQS = [
  {
    question: "Do I need reception to see the festival schedule?",
    answer:
      "No. Join the event in Blip while you still have data — at home, on the bus, wherever — and the schedule downloads to your iPhone. Once you are on site it reads from the phone, not the network. You can check set times and session times with the towers completely overloaded.",
  },
  {
    question: "How do event updates reach me when there is no signal?",
    answer:
      "They hop phone to phone. Blip runs a Bluetooth Low Energy mesh: your iPhone passes messages to nearby iPhones running Blip, which pass them on again. An update that enters the mesh anywhere in the crowd spreads outward through it. No Wi-Fi, no mobile data, and no event infrastructure required.",
  },
  {
    question: "Which events is Blip for?",
    answer:
      "Any gathering dense enough to break mobile reception. Music festivals are the obvious one, but Blip is built the same way for sporting events, concerts, and ultra marathons — anywhere thousands of phones hit the same tower at once, or the course runs well past coverage.",
  },
  {
    question: "What happens if I do not join the event before I arrive?",
    answer:
      "You will have less on your phone to start with. Joining early is what pulls the event down onto your device, so do it before you leave home. If you join on site with patchy signal it may take longer, and you will pick up what is already circulating through the mesh around you.",
  },
  {
    question: "Is there an event schedule app that works offline on iPhone?",
    answer:
      "Yes — Blip, on iPhone. It is an iOS app that keeps the event schedule readable with no internet connection, and carries live updates across the crowd over Bluetooth mesh. It is iOS only, requires iOS 17 or newer, and there is no Android version. Turn Bluetooth on before you reach the gate.",
  },
  {
    question: "Can I see announcements and lost and found in the app?",
    answer:
      "Yes — those are attendee screens in the app. The event page has tiles for the event map, schedule, announcements, and lost and found. The updates view lists things like gate openings, transport, and water station locations, plus the event chat channels you can join.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
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
      <EventsClient faqs={FAQS} />
    </>
  );
}
