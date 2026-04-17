import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["three", "framer-motion", "lucide-react"],
  },
};

export default nextConfig;
