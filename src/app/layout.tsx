import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blip — Mesh Chat for Festivals",
  description:
    "Stay connected with your crew at festivals — no signal required. Blip uses Bluetooth mesh to relay messages through the crowd.",
  metadataBase: new URL("https://heyblip.au"),
  openGraph: {
    title: "Blip — Mesh Chat for Festivals",
    description:
      "Stay connected with your crew at festivals — no signal required.",
    url: "https://heyblip.au",
    siteName: "Blip",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blip — Mesh Chat for Festivals",
    description:
      "Stay connected with your crew at festivals — no signal required.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-jakarta)]">
        {children}
      </body>
    </html>
  );
}
