import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  metadataBase: new URL("https://opensourceforbusiness.example"),
  title: {
    default: "OpenSource for Business",
    template: "%s · OpenSource for Business",
  },
  description: "A curated, sales-ready catalog of open-source enterprise software across eight business departments.",
  keywords: ["open source", "enterprise software", "self-hosted", "software catalog", "commercial open source"],
  openGraph: {
    title: "OpenSource for Business",
    description: "Find enterprise software you can deploy, adapt, support, and build services around.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
