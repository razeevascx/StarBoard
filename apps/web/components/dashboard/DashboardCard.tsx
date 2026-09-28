import type { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function DashboardCard({ title, description, children }: DashboardCardProps) {
  return (
    <section className="flex flex-col border border-ctp-surface1/60 bg-ctp-mantle p-6 sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 max-w-lg text-sm leading-6 text-ctp-subtext1">{description}</p>
      <div className="mt-auto pt-8">{children}</div>
    </section>
  );
}
