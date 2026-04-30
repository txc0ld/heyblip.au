import type { Metadata } from "next";
import { SOCIAL_IMAGE } from "@/lib/seo";
import TechClient from "./TechClient";

const TITLE = "Technical Specs — Blip Mesh Protocol";
const DESCRIPTION =
  "Inside Blip's mesh: Bluetooth LE 5.0, Noise XX handshake with Ed25519 packet signing, adaptive gossip routing, and 7-hop TTL — built for 100,000+ users at any event.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/tech" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/tech",
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

export default function Page() {
  return <TechClient />;
}
