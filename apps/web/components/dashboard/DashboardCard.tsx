import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="max-w-lg text-sm leading-6">{description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto pt-2">{children}</CardContent>
    </Card>
  );
}
