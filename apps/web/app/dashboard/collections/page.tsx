import type { Metadata } from "next";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

export const metadata: Metadata = { title: "Collections | Starboard" };

export default function CollectionsPage() {
  return <DashboardSection title="Collections" description="Keep related bookmarks together." emptyTitle="No collections to display" emptyDescription="A little organization for your projects, interests, and everyday essentials." />;
}
