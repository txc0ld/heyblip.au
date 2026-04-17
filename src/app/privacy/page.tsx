import type { Metadata } from "next";
import PrivacyClient from "./PrivacyClient";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Blip handles your data. End-to-end encrypted messages, no tracking, no advertising IDs, no contact uploads. Minimum data collection, Australian privacy principles.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Privacy Policy — Blip",
    description:
      "End-to-end encrypted messages, no tracking, no advertising IDs. Minimum data collection.",
    url: "https://heyblip.au/privacy",
    type: "article",
    images: ["/Blipwhitelogo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy — Blip",
    description:
      "End-to-end encrypted messages, no tracking, no advertising IDs.",
    images: ["/Blipwhitelogo.png"],
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
