import type { Metadata } from "next";
import { auth, currentUser } from "@clerk/nextjs/server";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { AccountButton } from "@/components/dashboard/AccountButton";
import { InstallButton } from "@/components/InstallButton";
import { SectionHeading } from "@/components/SectionHeading";

export const metadata: Metadata = {
  title: "Dashboard | Starboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  await auth.protect();
  const user = await currentUser();
  const name = user?.firstName || user?.username;

  return (
    <>
        <SectionHeading
          id="dashboard-title"
          eyebrow="Your dashboard"
          title={name ? `Welcome, ${name}.` : "Welcome to Starboard."}
          description="Make yourself at home. Set up your browser and manage your account in one place."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <DashboardCard title="Your next tab starts here" description="Install the Starboard extension to keep your favorite links and bookmarks close whenever you open a new tab.">
            <InstallButton>Get the extension</InstallButton>
          </DashboardCard>
          <DashboardCard title="Your account" description="Update your profile, manage your sign-in methods, and review your active sessions.">
            {user?.primaryEmailAddress?.emailAddress ? (
              <p className="mb-5 break-all text-sm text-ctp-subtext0">{user.primaryEmailAddress.emailAddress}</p>
            ) : null}
            <AccountButton />
          </DashboardCard>
        </div>
    </>
  );
}
