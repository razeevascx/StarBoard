import type { Metadata } from "next";
import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await auth.protect();

  return (
    <div className="flex min-h-screen flex-col bg-ctp-base text-ctp-text">
      <div className="flex w-full flex-1 flex-col md:flex-row">
        <DashboardSidebar />
        <main className="min-w-0 flex-1 px-6 py-10 sm:px-8 sm:py-12">{children}</main>
      </div>
    </div>
  );
}
