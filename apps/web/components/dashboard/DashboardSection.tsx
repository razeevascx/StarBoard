import { auth } from "@clerk/nextjs/server";
import { BracketCard } from "@/components/hangry-ui/components/bracket-card";
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
      <SectionHeading as="h1" id="section-title" title={title} description={description} />
      <BracketCard variant="brackets" className="mt-8">
        <div className="py-8 text-center">
          <h2 className="text-base font-semibold leading-snug text-ctp-text">{emptyTitle}</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{emptyDescription}</p>
        </div>
      </BracketCard>
    </>
  );
}
