import type { Metadata } from "next";
import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { listCollections } from "@/lib/library";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth.protect();
  const collections = await listCollections(userId);

  return <DashboardShell collections={collections}>{children}</DashboardShell>;
}
