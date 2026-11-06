import type { Metadata, Viewport } from "next";
import { Anton, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { profile, SITE_URL } from "@/content/site";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--font-inter-tight", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap", preload: false });

const title = `${profile.name} — Cloud & DevOps Engineer`;
const description = `${profile.name}: Cloud & DevOps Engineer and Serverless Developer in Buea, Cameroon. ${profile.tagline} Play the talking drum — your rhythm travels through Amazon SNS.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    url: "/",
    title,
    description,
    siteName: "Josue.cloud",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${profile.name} — ${profile.tagline}` }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
};

export const viewport: Viewport = { themeColor: "#0B0B0C", colorScheme: "dark" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "Cloud & DevOps Engineer",
  url: SITE_URL,
  sameAs: [profile.links.linkedin, profile.links.github, profile.links.devto],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anton.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
