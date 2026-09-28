import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export const metadata: Metadata = { title: "Trash | Starboard" };

export default function TrashPage() {
  return <DashboardSection title="Trash" description="A place to review removed bookmarks." emptyTitle="No items to display" emptyDescription="There are no removed bookmarks to show here." />;
}
