import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle className="text-lg">Reset password</CardTitle>
        <CardDescription>
          Enter your email and we’ll send a reset link.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" />
        </div>

        <Button className="w-full">Send reset link</Button>

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
