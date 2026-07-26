import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://heyblip.au";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${base}/download`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/organisers`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/tech`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/features`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/features/chat`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/features/safety`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/features/events`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/features/nearby`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/features/profile`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/acceptable-use`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
