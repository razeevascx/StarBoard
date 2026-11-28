import type { Metadata } from "next";
import { authAppearance } from "@/lib/auth-appearance";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign in | StartBoard",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <SignIn
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
      appearance={authAppearance}
    />
  );
}
