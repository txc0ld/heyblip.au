import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const OG_IMAGE = {
  url: "/Blipwhitelogo.png",
  width: 2134,
  height: 1572,
  alt: "Blip — Bluetooth mesh chat",
};

export const metadata: Metadata = {
  title: {
    default: "Blip — Mesh Chat for Festivals",
    template: "%s — Blip",
  },
  description:
    "Stay connected with your crew at festivals — no signal required. Blip uses Bluetooth mesh to relay messages through the crowd.",
  metadataBase: new URL("https://heyblip.au"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Blip — Mesh Chat for Festivals",
    description:
      "Stay connected with your crew at festivals — no signal required.",
    url: "https://heyblip.au",
    siteName: "Blip",
    type: "website",
    locale: "en_AU",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blip — Mesh Chat for Festivals",
    description:
      "Stay connected with your crew at festivals — no signal required.",
    images: [OG_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-jakarta)]">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
