import type { Metadata } from "next";
import Link from "next/link";
import { getSiteUrl } from "@/lib/site-url";

const siteUrl = getSiteUrl();
const title = "Terms and conditions | StartBoard";
const description = "The terms for using StartBoard’s website, bookmark dashboard, and connected tools.";

export const metadata: Metadata = {
  title,
  description,
  alternates: siteUrl ? { canonical: new URL("/terms", siteUrl).href } : undefined,
  openGraph: { title, description, url: siteUrl ? new URL("/terms", siteUrl).href : undefined },
};

export default function TermsPage() {
  return (
    <>
      <h1>Terms and conditions</h1>
      <p className="mt-4 text-sm">Last updated: <time dateTime="2026-11-28">28 November 2026</time></p>
      <p className="mt-6">These terms govern your use of StartBoard’s website, hosted bookmark dashboard, and connected tools, maintained by Razeev (@razeevascx). By using the service, you agree to these terms. If you do not agree, stop using the service.</p>
      <section>
        <h2>Using StartBoard</h2>
        <p>You may use StartBoard to save and organize links and access supported integrations, subject to these terms and applicable law. You must be legally able to enter this agreement, or have permission from a parent or guardian where required. You are responsible for maintaining accurate account information and keeping your sign-in credentials and connected apps secure.</p>
      </section>
      <section>
        <h2>Acceptable use</h2>
        <p>Do not use StartBoard for unlawful activity, upload content you have no right to use, distribute malware, harass others, or infringe privacy or intellectual property rights. Do not attempt to access other users’ data, bypass access controls, or disrupt or overload the service. Report suspected security issues through our contact channels without exposing private data publicly.</p>
      </section>
      <section>
        <h2>Your content</h2>
        <p>You retain your rights in the bookmarks, descriptions, and other content you provide. You give StartBoard permission to store, process, and display that content as needed to operate the features you use. You are responsible for your content and for keeping independent copies of important links. Our handling of personal information is described in the <Link href="/privacy">privacy policy</Link>.</p>
      </section>
      <section>
        <h2>External links and integrations</h2>
        <p>Bookmarks, previews, authentication, and connected apps may involve third-party services with their own terms. StartBoard does not control or endorse the content of linked websites. An authorized MCP client can act on your library, including deleting information; review its permissions and actions carefully. You are responsible for the integrations you authorize.</p>
      </section>
      <section>
        <h2>Availability and changes</h2>
        <p>Features may change, be interrupted, or be discontinued. We do not guarantee uninterrupted access, error-free operation, or that stored information will always be recoverable. We may restrict or suspend access to address abuse, security risks, legal requirements, or violations of these terms.</p>
      </section>
      <section>
        <h2>Ending your use</h2>
        <p>You can stop using StartBoard at any time, disconnect integrations, and remove the extension. Use the dashboard to remove saved content, or contact us to request account deletion. Uninstalling the extension does not automatically remove your hosted data. Permanently deleted library items cannot be restored through the dashboard.</p>
      </section>
      <section>
        <h2>Disclaimers and responsibility</h2>
        <p>To the extent permitted by applicable law, StartBoard is provided “as is” and “as available,” without warranties of fitness for a particular purpose or uninterrupted availability. To that same extent, the maintainer is not responsible for indirect or consequential losses arising from use of the service. Nothing in these terms excludes liability that cannot lawfully be excluded or limits mandatory consumer rights.</p>
      </section>
      <section>
        <h2>Software and intellectual property</h2>
        <p>Software made available through the StartBoard repository is governed by the license accompanying that software. These service terms do not replace that license or grant additional rights to third-party content, names, or trademarks.</p>
      </section>
      <section>
        <h2>Updates and contact</h2>
        <p>We may revise these terms as StartBoard evolves. Updated terms will appear here with a revised date; material changes will be communicated through the service where required. For questions or disputes, <Link href="/contact">contact the maintainer</Link> so we can try to resolve the issue. Any mandatory rights under the laws that apply to you remain in effect.</p>
      </section>
    </>
  );
}
