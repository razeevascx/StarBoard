import type { Metadata } from "next";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Contact | Starboard",
  description: "Get in touch with the Starboard team.",
};

export default function ContactPage() {
  return (
    <div id="top" className="min-h-screen bg-ctp-base text-ctp-text">
      <Navbar />
      <main id="main" tabIndex={-1}>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
