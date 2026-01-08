"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ShieldIcon } from "lucide-react";

export function BasicInfoCard({
  displayName,
  onDisplayNameChange,
  username,
  onUsernameChange,
  pronouns,
  onPronounsChange,
  bio,
  onBioChange,
  onPrivacyClick,
}: {
  displayName: string;
  onDisplayNameChange: (v: string) => void;
  username: string;
  onUsernameChange: (v: string) => void;
  pronouns: string;
  onPronounsChange: (v: string) => void;
  bio: string;
  onBioChange: (v: string) => void;
  onPrivacyClick: () => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Basic info</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={onPrivacyClick}
          className="gap-2"
        >
          <ShieldIcon className="h-4 w-4" />
          Privacy
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="displayName">Display name</Label>
          <Input
            id="displayName"
            placeholder="Saki"
            value={displayName}
            onChange={(e) => onDisplayNameChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="sakilakmal"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Letters, numbers, and underscore only.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pronouns">Pronouns (optional)</Label>
          <Input
            id="pronouns"
            placeholder="he/him"
            value={pronouns}
            onChange={(e) => onPronounsChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell people about you…"
            value={bio}
            onChange={(e) => onBioChange(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Max 200 characters.</p>
        </div>
      </CardContent>
    </Card>
  );
}
