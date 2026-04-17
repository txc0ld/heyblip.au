import type { Metadata } from "next";
import TechClient from "./TechClient";

export const metadata: Metadata = {
  title: "Technical Specs",
  description:
    "How Blip works: BLE mesh transport, Noise XX encryption, Cloudflare WebSocket relay fallback, Ed25519 packet signing, and native SwiftUI on iOS 17+. Open source on GitHub.",
  alternates: {
    canonical: "/tech",
  },
  openGraph: {
    title: "Blip Technical Specs",
    description:
      "BLE mesh, Noise XX encryption, WebSocket relay fallback, native SwiftUI. The engineering behind Blip.",
    url: "https://heyblip.au/tech",
    type: "article",
    images: ["/Blipwhitelogo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blip Technical Specs",
    description:
      "BLE mesh, Noise XX encryption, WebSocket relay fallback, native SwiftUI.",
    images: ["/Blipwhitelogo.png"],
  },
};

export default function TechPage() {
  return <TechClient />;
}
