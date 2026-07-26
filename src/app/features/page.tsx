import type { Metadata } from "next";
import { SOCIAL_IMAGE } from "@/lib/seo";
import FeaturesClient from "./FeaturesClient";

const TITLE = "Blip Features — Chat, SOS & Events With No Signal";
const DESCRIPTION =
  "Everything Blip does without internet: encrypted group chat, voice push-to-talk, emergency SOS, event schedules, and finding friends — all over Bluetooth mesh.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/features" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/features",
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

const SITE_URL = "https://heyblip.au";

const features = [
  {
    name: "Chat",
    href: "/features/chat",
    description:
      "Group chats, end-to-end encrypted messaging, voice notes, and push-to-talk that relay phone-to-phone over Bluetooth mesh — no internet or signal required.",
  },
  {
    name: "Safety & SOS",
    href: "/features/safety",
    description:
      "An emergency SOS broadcast that reaches every nearby Blip phone at priority when networks are down, plus a medical assistance flow for events.",
  },
  {
    name: "Events",
    href: "/features/events",
    description:
      "Find and join festivals, sporting events, and concerts, then keep the schedule and live updates on your phone when reception fails on site.",
  },
  {
    name: "Nearby & Friends",
    href: "/features/nearby",
    description:
      "See which friends are nearby and how far away they are, follow the friend map, and set crew meeting points — all without reception.",
  },
  {
    name: "Profile",
    href: "/features/profile",
    description:
      "A profile without a phone number, cryptographic identity, friends-only location sharing, and battery controls built for long event days.",
  },
];

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Blip features",
  description: DESCRIPTION,
  itemListElement: features.map((f, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: f.name,
    description: f.description,
    url: `${SITE_URL}${f.href}`,
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <FeaturesClient features={features} />
    </>
  );
}
