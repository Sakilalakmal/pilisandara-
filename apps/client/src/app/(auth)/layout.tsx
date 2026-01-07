// app/(auth)/layout.tsx
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh text-foreground">
      <div className="mx-auto flex min-h-dvh w-full max-w-110  flex-col justify-center px-4 py-10">
        {/* Brand header (minimal) */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            pilisandara <span className="font-normal">(පිළිසඳර)</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Learn together. Build together.
          </p>
        </div>

        {children}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <span className="underline underline-offset-4">Terms</span> and{" "}
          <span className="underline underline-offset-4">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
