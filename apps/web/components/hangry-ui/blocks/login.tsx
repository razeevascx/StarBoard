"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Google, GitHubDark } from "@ridemountainpig/svgl-react";
import { cn } from "cn";
import Link from "next/link";
import { Badge } from "../components/badge";
import { Banner } from "../components/banner";
import { Button } from "../components/button";
import { Card } from "../components/card";

interface LoginProps extends Omit<ComponentProps<"form">, "title" | "action"> {
  title?: string;
  description?: string;
  brand?: string;
  showSocial?: boolean;
  onProviderLogin?: (provider: "google" | "github") => void;
  loading?: boolean;
  error?: string;
  forgotPasswordHref?: string;
  signupHref?: string;
  authContent?: ReactNode;
}

function LoginLayout({
  layout,
  title = "Welcome back",
  description = "Sign in to pick up where you left off.",
  brand = "Studio",
  showSocial = true,
  onProviderLogin,
  loading = false,
  error,
  forgotPasswordHref = "/forgot-password",
  signupHref = "/signup",
  authContent,
  onSubmit,
  className,
  children,
  ...props
}: LoginProps & { layout: "card" | "split" | "minimal" }) {
  return (
    <div data-slot="login" data-layout={layout} className="@container w-full">
      <div
        className={cn(
          layout === "split" &&
            "grid min-h-dvh min-w-0 grid-cols-1 grid-rows-[auto_1fr] bg-ctp-mantle @3xl:grid-cols-2 @3xl:grid-rows-1",
        )}
      >
        {layout === "split" && (
          <aside className="flex min-w-0 flex-col justify-between gap-10 border-b border-ctp-surface1/60 bg-ctp-crust/40 p-6 sm:p-10 @3xl:border-r @3xl:border-b-0 @3xl:p-16">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="text-base font-semibold tracking-tight text-ctp-mauve"
              >
                {brand}
              </Link>
              <Badge variant="purple">Bookmark library</Badge>
            </div>
            <div className="hidden max-w-xl @3xl:block">
              <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl @3xl:text-5xl">
                Save every link worth keeping.
              </h1>
              <p className="mt-5 max-w-sm text-sm leading-7 text-ctp-subtext1 sm:text-base">
                Save what matters, organize it your way, and find it when you
                need it.
              </p>
            </div>
          </aside>
        )}
        <Card
          title={title}
          description={description}
          className={cn(
            "mx-auto max-w-md!",
            layout === "split" &&
              "m-0! flex min-w-0 max-w-none! flex-col justify-center border-0 bg-transparent p-6 shadow-none [&>div]:h-auto sm:p-10 @3xl:p-16",
            layout === "minimal" &&
              "border-0 bg-transparent! text-foreground shadow-none",
          )}
        >
          {authContent ?? (
            <LoginForm
              {...props}
              title={title}
              showSocial={showSocial}
              onProviderLogin={onProviderLogin}
              loading={loading}
              error={error}
              forgotPasswordHref={forgotPasswordHref}
              signupHref={signupHref}
              onSubmit={onSubmit}
              className={className}
            >
              {children}
            </LoginForm>
          )}
        </Card>
      </div>
    </div>
  );
}

export function Login(props: LoginProps = {}) {
  return <LoginLayout {...props} layout="card" />;
}

export function LoginSplit(props: LoginProps = {}) {
  return <LoginLayout {...props} layout="split" />;
}

export function LoginMinimal(props: LoginProps = {}) {
  return <LoginLayout {...props} layout="minimal" />;
}

function LoginForm({
  title,
  showSocial,
  onProviderLogin,
  loading,
  error,
  forgotPasswordHref,
  signupHref,
  onSubmit,
  className,
  children,
  ...props
}: LoginProps) {
  const id = useId();
  return (
    <form
      {...props}
      aria-label={props["aria-label"] ?? title}
      className={cn("space-y-5", className)}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(event);
      }}
    >
      {error && (
        <div role="alert">
          <Banner variant="destructive" dismissible={false} message={error} />
        </div>
      )}
      {showSocial && (
        <div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              disabled={loading || !onProviderLogin}
              onClick={() => onProviderLogin?.("google")}
            >
              <Google width={16} height={16} aria-hidden="true" />
              Google
            </Button>
            <Button
              variant="outline"
              disabled={loading || !onProviderLogin}
              onClick={() => onProviderLogin?.("github")}
            >
              <GitHubDark width={16} height={16} aria-hidden="true" />
              GitHub
            </Button>
          </div>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            Or continue with email
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor={`${id}-email`} className="block text-sm font-medium">
          Email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          disabled={loading}
          className="min-h-11 w-full border border-border bg-background px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
        />
      </div>
      <PasswordField
        id={id}
        loading={loading}
        forgotPasswordHref={forgotPasswordHref}
      />
      {children}
      <Button
        type="submit"
        className="w-full"
        disabled={loading || !onSubmit}
        aria-busy={loading}
      >
        {loading ? "Signing in…" : "Sign in"}
      </Button>
      {signupHref && (
        <p className="text-center text-xs text-muted-foreground">
          New here?{" "}
          <a
            href={signupHref}
            className="font-medium text-foreground hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            Create an account
          </a>
        </p>
      )}
    </form>
  );
}

function PasswordField({
  id,
  loading,
  forgotPasswordHref,
}: {
  id: string;
  loading?: boolean;
  forgotPasswordHref?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={`${id}-password`} className="text-sm font-medium">
          Password
        </label>
        {forgotPasswordHref && (
          <a
            href={forgotPasswordHref}
            className="text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            Forgot password?
          </a>
        )}
      </div>
      <div className="relative">
        <input
          id={`${id}-password`}
          name="password"
          type={visible ? "text" : "password"}
          autoComplete="current-password"
          required
          disabled={loading}
          className="min-h-11 w-full border border-border bg-background pr-12 pl-3 text-sm focus-visible:outline-2 focus-visible:outline-ring disabled:opacity-50"
        />
        <Button
          variant="ghost"
          className="absolute inset-y-0 right-0 px-3"
          disabled={loading}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible(!visible)}
        >
          {visible ? (
            <EyeOff size={16} aria-hidden="true" />
          ) : (
            <Eye size={16} aria-hidden="true" />
          )}
        </Button>
      </div>
    </div>
  );
}
