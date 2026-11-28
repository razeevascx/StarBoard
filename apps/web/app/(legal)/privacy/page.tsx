import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const title = "Privacy policy | Starboard";
const description = "How Starboard handles account information, bookmarks, and connected services.";

export const metadata: Metadata = {
  title,
  description,
  alternates: siteUrl ? { canonical: new URL("/privacy", siteUrl).href } : undefined,
  openGraph: { title, description, url: siteUrl ? new URL("/privacy", siteUrl).href : undefined },
};

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy policy</h1>
      <p className="mt-4 text-sm">Last updated: <time dateTime="2026-11-28">28 November 2026</time></p>
      <p className="mt-6">This policy explains how Starboard, maintained by Razeev (@razeevascx), handles information when you use this website and its hosted bookmark dashboard. Browser extension features may also store information on your device; review the extension’s permissions before installing it.</p>
      <section>
        <h2>Information we handle</h2>
        <p>When you sign in, Clerk manages authentication. Starboard stores your account identifier, email address, and display name, together with bookmarks and collections you create or import, including their URLs, titles, descriptions, and organization. Our hosting and authentication providers may process technical information such as IP addresses, browser details, request logs, and session information to deliver and secure the service.</p>
      </section>
      <section>
        <h2>How information is used</h2>
        <p>We use account and library information to provide sign-in, save and organize your links, and carry out actions you request. We use technical information to keep the service working, prevent abuse, and investigate problems. Where data protection law requires a lawful basis, providing requested account features relies on performing our agreement with you; service security and troubleshooting rely on our legitimate interests in operating a reliable service.</p>
      </section>
      <section>
        <h2>Cookies and device storage</h2>
        <p>Authentication uses cookies and related session technologies to keep you signed in and protect your account. The dashboard also uses local storage to remember your sidebar preference. You can clear browser storage or block cookies through your browser settings, though sign-in and saved preferences may stop working.</p>
      </section>
      <section>
        <h2>Service providers and external websites</h2>
        <p>Clerk provides authentication, Neon provides the hosted database, and infrastructure providers process requests needed to run Starboard. When a bookmark preview is loaded, Starboard may request the saved URL to retrieve preview metadata; your browser may also request images or icons from external websites. Those websites receive the technical information associated with those requests and apply their own privacy policies.</p>
      </section>
      <section>
        <h2>Connected apps and MCP</h2>
        <p>If you authorize an MCP client, it can access your library and perform supported actions on your behalf, including creating, editing, or deleting data. Information returned to that client is also subject to its provider’s policies. Only connect apps you trust, and revoke their authorization when you no longer need access.</p>
      </section>
      <section>
        <h2>Retention and deletion</h2>
        <p>Saved library data is retained to provide your account features. Moving a bookmark to Trash does not permanently delete it; use the permanent deletion action to remove it from your library. For account deletion or other data removal requests, contact us. Backup copies and operational logs may remain for recovery, security, or legal obligations until their applicable retention cycles expire. Removing the extension does not itself delete your hosted account or library.</p>
      </section>
      <section>
        <h2>Your choices and rights</h2>
        <p>You can edit your library and manage your account through the service. Depending on your location, you may also have rights to access, correct, delete, or receive a copy of personal information, restrict processing, or object to processing based on legitimate interests. Contact us to exercise these rights; we may need to verify account ownership. You can also complain to your local data protection authority, including the <a href="https://ico.org.uk/make-a-complaint/">Information Commissioner’s Office</a> in the UK.</p>
      </section>
      <section>
        <h2>Security and international processing</h2>
        <p>We use authenticated access and account-scoped database access to help protect your library. No online service can guarantee absolute security. Providers may process information outside your country under their service arrangements and applicable data protection requirements. Contact us for questions about processing locations or safeguards.</p>
      </section>
      <section>
        <h2>Contact and updates</h2>
        <p>For privacy questions or requests, use our <Link href="/contact">contact page</Link> to reach the maintainer. Public GitHub issues are visible to others: do not post passwords, tokens, or private account information there. This policy may change as the service evolves; the date above identifies the latest version.</p>
      </section>
    </>
  );
}
