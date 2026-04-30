import type { Metadata } from "next";
import { SOCIAL_IMAGE } from "@/lib/seo";
import OrganisersClient from "./OrganisersClient";

const TITLE = "For Organisers — Mesh Comms for Festivals & Events";
const DESCRIPTION =
  "Running a festival, conference, marathon, or sporting event? Partner with Blip for end-to-end encrypted Bluetooth mesh comms when mobile reception fails.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/organisers" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/organisers",
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
  return <OrganisersClient />;
}
