import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Blip — the Bluetooth mesh chat app for events. Acceptable use, service availability, liability, and governing law.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms of Service — Blip",
    description:
      "Terms of Service for Blip — the Bluetooth mesh chat app for events.",
    url: "https://heyblip.au/terms",
    type: "article",
    images: ["/Blipwhitelogo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service — Blip",
    description:
      "Terms of Service for Blip — the Bluetooth mesh chat app for events.",
    images: ["/Blipwhitelogo.png"],
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
