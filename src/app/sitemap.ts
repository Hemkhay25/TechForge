import type { MetadataRoute } from "next";
import { paths, projects, skills } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const fixedRoutes = ["", "/skills", "/paths", "/projects", "/pricing", "/about", "/contact", "/help", "/privacy", "/terms", "/subscription-policy"];
  return [
    ...fixedRoutes.map((route) => ({ url: `${baseUrl}${route}`, changeFrequency: "weekly" as const, priority: route === "" ? 1 : 0.7 })),
    ...skills.map(({ slug }) => ({ url: `${baseUrl}/skills/${slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...paths.map(({ slug }) => ({ url: `${baseUrl}/paths/${slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...projects.map(({ slug }) => ({ url: `${baseUrl}/projects/${slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
