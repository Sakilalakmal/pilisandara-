import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  // Later we will read token from URL (search params) and submit to Better Auth.
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle className="text-lg">Set a new password</CardTitle>
        <CardDescription>
          Choose a strong password you haven’t used before.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a new password"
            autoComplete="new-password"
          />
          <p className="text-xs text-muted-foreground">
            Use at least 8 characters.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Re-enter your new password"
            autoComplete="new-password"
          />
        </div>

        <Button className="w-full">Update password</Button>

        <Link
          href="/login"
          className="block text-center text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          Back to sign in
        </Link>
      </CardContent>
    </Card>
  );
}
