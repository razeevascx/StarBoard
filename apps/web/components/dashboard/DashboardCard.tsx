import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/hangry-ui/components/card";

type DashboardCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function DashboardCard({ title, description, children }: DashboardCardProps) {
  return (
    <Card className="max-w-none sm:p-8">
      <CardHeader>
        <h2 className="text-lg font-semibold leading-snug tracking-tight text-ctp-text">{title}</h2>
        <CardDescription className="max-w-prose text-sm leading-relaxed text-ctp-subtext0">{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-2">{children}</CardContent>
    </Card>
  );
}
