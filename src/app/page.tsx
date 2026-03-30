"use client";

import { motion } from "framer-motion";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Security from "@/components/Security";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mesh-gradient relative overflow-hidden"
    >
      <Nav />
      <Hero />
      <Features />
      <HowItWorks />
      <Security />
      <Pricing />
      <CTA />
      <Footer />
    </motion.main>
  );
}
