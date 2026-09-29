import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  alternates: siteUrl ? { canonical: siteUrl.href } : undefined,
};

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-ctp-base text-ctp-text">
      <Navbar />
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <FeaturesSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
