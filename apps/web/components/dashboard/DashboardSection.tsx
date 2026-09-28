import { auth } from "@clerk/nextjs/server";
import { SectionHeading } from "@/components/SectionHeading";

type DashboardSectionProps = {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
};

export async function DashboardSection({ title, description, emptyTitle, emptyDescription }: DashboardSectionProps) {
  await auth.protect();

  return (
    <>
      <SectionHeading id="section-title" eyebrow="Your library" title={title} description={description} />
      <div className="mt-8 rounded-2xl border border-dashed border-ctp-surface1 bg-ctp-mantle/30 px-6 py-16 text-center">
        <h2 className="text-lg font-medium">{emptyTitle}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-ctp-subtext0">{emptyDescription}</p>
      </div>
    </>
  );
}
