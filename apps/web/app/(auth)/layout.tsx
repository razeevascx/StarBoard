import type { ReactNode } from "react";
import { LoginSplit } from "@/components/hangry-ui/blocks/login-split";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="min-h-dvh bg-ctp-base text-ctp-text">
      <LoginSplit
        brand="✦ Starboard"
        title=""
        description=""
        authContent={
          <div className="mx-auto w-full min-w-0 max-w-sm">{children}</div>
        }
      />
    </main>
  );
}
