import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

const siteUrl = getSiteUrl();
const description = "A calm, customizable browser start page for bookmarks, quick links, and everything you need in a new tab.";

export const metadata: Metadata = {
  metadataBase: siteUrl ?? undefined,
  title: "Starboard — Your calm browser start page",
  description,
  applicationName: "Starboard",
  openGraph: {
    type: "website",
    siteName: "Starboard",
    title: "Starboard — Your calm browser start page",
    description,
    url: siteUrl?.href,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Starboard — Your calm browser start page",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ClerkProvider
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: "#cba6f7",
              colorPrimaryForeground: "#1e1e2e",
              colorBackground: "#181825",
              colorForeground: "#cdd6f4",
              colorMutedForeground: "#a6adc8",
              colorInput: "#1e1e2e",
              colorInputForeground: "#cdd6f4",
              fontFamily: "var(--font-geist-sans), sans-serif",
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
