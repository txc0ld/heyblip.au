import type { Metadata } from "next";
import { SOCIAL_IMAGE } from "@/lib/seo";
import TermsClient from "./TermsClient";

const TITLE = "Terms of Service — Blip";
const DESCRIPTION =
  "The terms governing your use of Blip, the Bluetooth mesh chat app for festivals and crowded events. Covers account rules, acceptable use, and liability.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/terms",
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
  return <TermsClient />;
}
