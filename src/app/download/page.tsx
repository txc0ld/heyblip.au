import type { Metadata } from "next";
import { SOCIAL_IMAGE } from "@/lib/seo";
import DownloadClient from "./DownloadClient";

const TITLE = "Download Blip for iOS";
const DESCRIPTION =
  "Get Blip on iPhone: the Bluetooth mesh chat app for festivals, conferences, hikes, and crowded events. Free core messaging, requires iOS 17 or newer.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/download" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/download",
    type: "website",
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
  return <DownloadClient />;
}
