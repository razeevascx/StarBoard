import { cn } from "../lib/cn";

type BoxProps = Readonly<{
  className?: string;
  children?: React.ReactNode;
}>;

export default function Box({ className, children }: BoxProps) {
  return (
    <div className={cn(className, "max-w-7xl mx-auto overflow-x-hidden")}>
      {children}
    </div>
  );
}
