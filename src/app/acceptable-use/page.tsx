import type { Metadata } from "next";
import AcceptableUseClient from "./AcceptableUseClient";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description:
    "Acceptable use of Blip — how we keep the mesh safe. No spam, no false SOS alerts, no harassment, no tampering with relayed encrypted messages.",
  alternates: {
    canonical: "/acceptable-use",
  },
  openGraph: {
    title: "Acceptable Use Policy — Blip",
    description:
      "How we keep the Blip mesh safe. No spam, no false SOS, no harassment.",
    url: "https://heyblip.au/acceptable-use",
    type: "article",
    images: ["/Blipwhitelogo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Acceptable Use Policy — Blip",
    description:
      "How we keep the Blip mesh safe. No spam, no false SOS, no harassment.",
    images: ["/Blipwhitelogo.png"],
  },
};

export default function AcceptableUsePage() {
  return <AcceptableUseClient />;
}
