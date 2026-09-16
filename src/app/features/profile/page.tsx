import type { Metadata } from "next";
import { SOCIAL_IMAGE } from "@/lib/seo";
import ProfileClient from "./ProfileClient";

const TITLE = "Profile & Friends — No Phone Number Needed";
const DESCRIPTION =
  "Blip needs no phone number. Your identity is a cryptographic key on your iPhone. Add friends by QR code or username, and control who sees your location.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/features/profile" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/features/profile",
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

const faqs = [
  {
    question: "Do I need a phone number to use Blip?",
    answer:
      "No. Blip never asks for your mobile number. Your iPhone generates a Curve25519 key pair for encryption and an Ed25519 key pair for signing when you install the app, and a hash of the Curve25519 public key is your identity on the mesh. On top of it you choose a display name, a handle and a short bio. The Add Friend screen says it in plain words: no phone number needed.",
  },
  {
    question: "How do I add friends on Blip?",
    answer:
      "Open Add Friend and Blip shows your personal QR code with your handle underneath it. A mate scans it using the Scan tab, or you tap Share my code to send it through any app you already use. If you would rather type, Add by username does the same job. Only people you approve become friends.",
  },
  {
    question: "Who can see my location on Blip?",
    answer:
      "You decide. Location sharing is off until you switch it on from the Nearby map, and while it is on your position goes out as a signed, unencrypted mesh broadcast that any nearby Blip phone can receive. Nearby visibility is a separate toggle that controls your presence announcement, so you can adjust one without touching the other.",
  },
  {
    question: "Can I stop people nearby from seeing me?",
    answer:
      "Yes. Nearby visibility is its own toggle on your profile, shown as On in the screenshot, and you can turn it off. With it off you stop appearing to other people running Blip around you. Your friends, your chats and the SOS features are managed separately under Safety & SOS.",
  },
  {
    question: "Does Blip sell my data?",
    answer:
      "No. There is no ad-tech in Blip, no advertising identifiers and no social graph mining. Direct messages are end-to-end encrypted; at an event they travel phone-to-phone, and when a phone has internet they can also pass through our relay as ciphertext. We would rather you check than take our word for it, so what is and is not stored is written out on our privacy page.",
  },
  {
    question: "What does battery mode do?",
    answer:
      "Battery mode is the power-management control at the bottom of your profile, shown set to All day in the screenshot. Mesh networking means your phone spends time listening for and relaying Bluetooth traffic, and this setting is where you decide how hard it works. We will not quote you a battery-life figure, because it depends on your phone and the crowd.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ProfileClient faqs={faqs} />
    </>
  );
}
