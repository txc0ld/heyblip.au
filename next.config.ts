import type { NextConfig } from "next";

const LINK_HEADER = [
  '</sitemap.xml>; rel="sitemap"',
  '</tech>; rel="service-doc"; type="text/html"',
  '</privacy>; rel="privacy-policy"',
  '</terms>; rel="terms-of-service"',
  '</terms>; rel="license"',
  '<mailto:support@heyblip.au>; rel="help"',
  '</>; rel="canonical"',
].join(", ");

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value: LINK_HEADER,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
