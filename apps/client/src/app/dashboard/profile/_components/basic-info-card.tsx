"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function BasicInfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic info</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display name</Label>
          <Input id="displayName" placeholder="Saki" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="sakilakmal" />
          <p className="text-xs text-muted-foreground">
            Letters, numbers, and underscore only.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pronouns">Pronouns (optional)</Label>
          <Input id="pronouns" placeholder="he/him" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" placeholder="Tell people about you…" />
          <p className="text-xs text-muted-foreground">Max 200 characters.</p>
        </div>
      </CardContent>
    </Card>
  );
}
