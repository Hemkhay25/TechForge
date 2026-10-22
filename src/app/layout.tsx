import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "TechForge — Learn skills. Build projects. Forge your future.",
    template: "%s | TechForge",
  },
  description: "Discover technology careers, explore beginner-friendly learning paths, and build practical skills at your own pace.",
  openGraph: {
    title: "TechForge — Learn skills. Build projects. Forge your future.",
    description: "Explore technology careers and practical learning paths with TechForge.",
    siteName: "TechForge",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
