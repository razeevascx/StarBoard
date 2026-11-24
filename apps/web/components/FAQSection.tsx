import Link from "next/link";
import { FaqCards, type FaqItem } from "@/components/hangry-ui/blocks/faq-cards";
import { contactUrl, githubUrl, installUrl } from "@/lib/site";

const questions: readonly FaqItem[] = [
  {
    id: "what-is-starboard",
    question: "What is Starboard?",
    answer:
      "Starboard is a customizable browser start page that puts your time and favorite links in one calm place.",
  },
  {
    id: "how-to-install",
    question: "How do I install it?",
    answer: (
      <span>
        Follow the{" "}
        <a
          href={installUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-ctp-mauve underline underline-offset-4 hover:text-ctp-lavender"
        >
          setup instructions on GitHub
        </a>{" "}
        to add Starboard to your browser.
      </span>
    ),
  },
  {
    id: "account-needed",
    question: "Do I need an account?",
    answer:
      "No account is needed for the start page. Sign in only if you want to sync bookmarks with the web dashboard.",
  },
  {
    id: "existing-bookmarks",
    question: "Can I use my existing browser bookmarks?",
    answer:
      "Yes. Grant bookmark access when you want Starboard to show your browser’s saved links and folders.",
  },
  {
    id: "bookmark-sync",
    question: "How does bookmark sync work?",
    answer:
      "Sign in through Settings → Account in the extension and grant bookmark access. Your browser bookmarks sync to the web dashboard, with folders organized into collections.",
  },
  {
    id: "mcp-access",
    question: "Can I connect AI assistants via MCP?",
    answer: (
      <span>
        Yes. Starboard exposes an OAuth-protected Model Context Protocol endpoint so assistants like
        Antigravity, Claude, Cursor, and VS Code can read and manage your library. Check{" "}
        <Link
          href="/dashboard/mcp"
          className="text-ctp-mauve underline underline-offset-4 hover:text-ctp-lavender"
        >
          Dashboard → MCP
        </Link>{" "}
        for connection setup.
      </span>
    ),
  },
  {
    id: "settings-storage",
    question: "Where are my settings stored?",
    answer:
      "Your start-page settings are saved locally in your browser. If you enable account sync, your synced bookmarks are also stored for use in the web dashboard.",
  },
  {
    id: "open-source",
    question: "Is Starboard open source?",
    answer: (
      <span>
        Yes. Explore the code and contribute on{" "}
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-ctp-mauve underline underline-offset-4 hover:text-ctp-lavender"
        >
          GitHub
        </a>
        .
      </span>
    ),
  },
  {
    id: "report-bug",
    question: "How can I report a bug or suggest a feature?",
    answer: (
      <span>
        Open an{" "}
        <a
          href={contactUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-ctp-mauve underline underline-offset-4 hover:text-ctp-lavender"
        >
          issue on GitHub
        </a>{" "}
        with the details of your bug or idea.
      </span>
    ),
  },
];

export function FAQSection() {
  return (
    <FaqCards
      id="faq"
      title="Good to know."
      description="The basics before you make yourself at home."
      items={questions}
      defaultOpenId="what-is-starboard"
      className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20"
    />
  );
}
