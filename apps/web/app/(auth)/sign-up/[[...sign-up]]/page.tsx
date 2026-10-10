import type { Metadata } from "next";
import { authAppearance } from "@/lib/auth-appearance";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign up | Starboard",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <SignUp
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
      appearance={authAppearance}
    />
  );
}
