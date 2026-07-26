import type { Metadata } from "next";
import { SOCIAL_IMAGE } from "@/lib/seo";
import ChatClient from "./ChatClient";

const TITLE = "Group Chat Without Internet or Phone Signal";
const DESCRIPTION =
  "Blip is an iOS group chat that works with no internet or signal. Messages hop phone-to-phone over encrypted Bluetooth mesh. Text, voice notes, push-to-talk.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/features/chat" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/features/chat",
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
    question: "Does Blip work without internet?",
    answer:
      "Yes. Blip needs no Wi-Fi, no mobile data and no server to send a message. Your iPhone talks straight to other iPhones nearby over Bluetooth Low Energy, and those phones pass the message along until it reaches your crew. The one requirement is simple: someone within Bluetooth range has to be running Blip too.",
  },
  {
    question: "Are Blip messages encrypted?",
    answer:
      "Yes. Blip agrees keys with a Noise XX handshake (Curve25519, ChaChaPoly, SHA256) and signs packets with Ed25519. The phones that relay your message through the crowd carry ciphertext they cannot open. It is strong, standard cryptography — not a proprietary scheme, and not military-grade marketing.",
  },
  {
    question: "How far does Bluetooth mesh reach?",
    answer:
      "Each hop covers roughly 40 metres on Bluetooth Low Energy 5.0, and up to about 100 metres line-of-sight. Blip allows up to seven hops per message, so effective reach lands around 200 to 300 metres through a crowd. Range grows with density — the more people nearby running Blip, the further your message travels.",
  },
  {
    question: "Can you send voice messages without service?",
    answer:
      "Yes. Voice notes and push-to-talk both run over the mesh. Hold the mic button, talk, release to send, and the clip relays phone-to-phone exactly like a text message does. No walkie talkie server sits in the middle. Keep clips short when the crowd is dense, because bigger payloads take more hops and more time.",
  },
  {
    question: "Do I need a phone number to use Blip group chats?",
    answer:
      "No. Blip identifies you by cryptographic keys generated on your iPhone plus a username, not by a mobile number. There are no ads and no advertising identifiers. At an event your message content never passes through a Blip server, so the group chat behaves the same whether the towers are up or completely dead.",
  },
  {
    question: "What happens if a mate is out of mesh range?",
    answer:
      "The message waits. Blip stores undelivered messages and forwards them when a path opens up, holding direct messages for about two hours. Crowds move constantly, so phones bridge gaps that were not there a minute ago. A message often lands the moment someone walks into the space between you.",
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
      <ChatClient faqs={faqs} />
    </>
  );
}
