import type { Metadata } from "next";
import SupportClient from "./SupportClient";

const TITLE = "Support — Blip";
const DESCRIPTION =
  "Get help with Blip. Contact email, response times, frequently asked questions, account deletion, abuse reporting, and links to our privacy policy, terms of service, and acceptable use policy.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/support" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/support",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function Page() {
  return <SupportClient />;
}
