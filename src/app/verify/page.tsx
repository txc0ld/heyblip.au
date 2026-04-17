import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyClient from "./VerifyClient";

export const metadata: Metadata = {
  title: "Verify Email",
  description:
    "Confirm your Blip email address to finish setting up your account.",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: "/verify",
  },
};

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyClient />
    </Suspense>
  );
}
