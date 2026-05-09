import { cn } from "../lib/cn";
import { memo } from "react";

type BoxProps = Readonly<{
  className?: string;
  children?: React.ReactNode;
}>;

const Box = memo(function Box({ className, children }: BoxProps) {
  return (
    <div className={cn(className, "max-w-7xl mx-auto overflow-x-hidden")}>
      {children}
    </div>
  );
});

export default Box;
