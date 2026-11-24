import type { Metadata } from "next";

import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { McpShowcaseSection } from "@/components/McpShowcaseSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  alternates: { canonical: siteUrl.href },
};

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-ctp-base text-ctp-text">
      <Navbar />
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <FeaturesSection />
        <McpShowcaseSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
