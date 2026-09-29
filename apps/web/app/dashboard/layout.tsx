import type { Metadata } from "next";
import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { CreateButton } from "@/components/dashboard/CreateButton";
import { listCollections } from "@/lib/library";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth.protect();
  const collections = await listCollections(userId);

  return (
    <div className="flex min-h-screen flex-col bg-ctp-base text-ctp-text">
      <div className="flex w-full flex-1 flex-col md:flex-row">
        <DashboardSidebar collections={collections} />
        <main className="relative min-w-0 flex-1 sm:px-8 sm:py-12">
          <div className="absolute right-0 top-0 sm:right-8 sm:top-12"><CreateButton collections={collections} /></div>
          {children}
        </main>
      </div>
    </div>
  );
}
