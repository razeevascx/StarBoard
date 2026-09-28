import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export const metadata: Metadata = { title: "Bookmarks | Starboard" };

export default function BookmarksPage() {
  return <DashboardSection title="Bookmarks" description="A home for the links you want to come back to." emptyTitle="No bookmarks to display" emptyDescription="Your saved links belong here, ready for your next visit." />;
}
