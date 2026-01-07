"use client";

import Link from "next/link";
import { JSX, useState, useTransition } from "react";
import { Loader2Icon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm, SignUpForm } from "@/types/auth-types";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "Something went wrong.";
}
export default function AuthPage(): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const [signIn, setSignIn] = useState<SignInForm>({
    email: "",
    password: "",
  });

  const [signUp, setSignUp] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
  });

  function updateSignIn<K extends keyof SignInForm>(
    key: K,
    value: SignInForm[K]
  ): void {
    setSignIn((prev: SignInForm) => ({ ...prev, [key]: value }));
  }

  function updateSignUp<K extends keyof SignUpForm>(
    key: K,
    value: SignUpForm[K]
  ): void {
    setSignUp((prev: SignUpForm) => ({ ...prev, [key]: value }));
  }

  function run(task: () => Promise<void>): void {
    setMessage(null);
    startTransition(() => {
      task().catch((e: unknown) => {
        setMessage(getErrorMessage(e));
      });
    });
  }

  const disabled: boolean = isPending;

  const handleGoogle = (): void =>
    run(async (): Promise<void> => {
      await authClient.signIn.social({ provider: "google" });
    });

  const handleGithub = (): void =>
    run(async (): Promise<void> => {
      await authClient.signIn.social({ provider: "github" });
    });

  const handleSignIn = (): void =>
    run(async (): Promise<void> => {
      const res = await authClient.signIn.email({
        email: signIn.email,
        password: signIn.password,
      });

      if (res?.error) {
        setMessage(res.error.message ?? "Sign in failed");
        return;
      }

      setMessage("Signed in ✅");
    });

  const handleSignUp = (): void =>
    run(async (): Promise<void> => {
      const res = await authClient.signUp.email({
        name: signUp.name,
        email: signUp.email,
        password: signUp.password,
      });

      if (res?.error) {
        setMessage(res.error.message ?? "Sign up failed");
        return;
      }

      setMessage("Account created ✅ Check your email for the OTP.");
      // Next step: redirect to /verify-email?email=...
    });

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle className="text-lg">Welcome back</CardTitle>
        <CardDescription>
          Sign in or create an account to continue.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* OAuth */}
        <div className="space-y-3">
          <Button
            className="w-full gap-2"
            onClick={handleGoogle}
            disabled={disabled}
          >
            {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
            Continue with Google
          </Button>

          <Button
            variant="secondary"
            className="w-full gap-2"
            onClick={handleGithub}
            disabled={disabled}
          >
            {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
            Continue with GitHub
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        {message ? (
          <p className="text-sm text-muted-foreground">{message}</p>
        ) : null}

        {/* Email auth */}
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" disabled={disabled}>
              Sign in
            </TabsTrigger>
            <TabsTrigger value="signup" disabled={disabled}>
              Create account
            </TabsTrigger>
          </TabsList>

          {/* SIGN IN */}
          <TabsContent value="signin" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={signIn.email}
                onChange={(e) => updateSignIn("email", e.target.value)}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  Forgot password?
                </Link>
              </div>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={signIn.password}
                onChange={(e) => updateSignIn("password", e.target.value)}
                disabled={disabled}
              />
            </div>

            <Button
              className="w-full gap-2"
              onClick={handleSignIn}
              disabled={disabled}
            >
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : null}
              Sign in
            </Button>
          </TabsContent>

          {/* SIGN UP */}
          <TabsContent value="signup" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Saki"
                autoComplete="name"
                value={signUp.name}
                onChange={(e) => updateSignUp("name", e.target.value)}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email2">Email</Label>
              <Input
                id="email2"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={signUp.email}
                onChange={(e) => updateSignUp("email", e.target.value)}
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password2">Password</Label>
              <Input
                id="password2"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                value={signUp.password}
                onChange={(e) => updateSignUp("password", e.target.value)}
                disabled={disabled}
              />
              <p className="text-xs text-muted-foreground">
                Use at least 8 characters.
              </p>
            </div>

            <Button
              className="w-full gap-2"
              onClick={handleSignUp}
              disabled={disabled}
            >
              {isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : null}
              Create account
            </Button>

            <p className="text-xs text-muted-foreground">
              We will send a verification email after signup.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
