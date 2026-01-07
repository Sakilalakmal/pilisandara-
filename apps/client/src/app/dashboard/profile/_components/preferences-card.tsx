"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TagInput } from "./tag-input";
import type { Intent } from "@/actions/dashboard/profile/schema";

const INTENT_VALUES: Intent[] = [
  "learn",
  "share",
  "network",
  "find_friends",
  "get_help",
  "teach",
];

function toIntentArray(values: string[]): Intent[] {
  return values.filter(
    (v): v is Intent => INTENT_VALUES.includes(v as Intent)
  );
}

interface PreferencesCardProps {
  interests?: string[];
  onInterestsChange: (v: string[] | undefined) => void;
  intent?: Intent[];
  onIntentChange: (v: Intent[] | undefined) => void;
}

export function PreferencesCard({
  interests,
  onInterestsChange,
  intent,
  onIntentChange,
}: PreferencesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Interests */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Interests</p>
          <TagInput
            value={interests ?? []}
            onChange={(v) => onInterestsChange(v.length ? v : undefined)}
            placeholder="e.g. Web dev, Anime, Fitness..."
            badgeClassName="bg-blue-500 text-white"
          />
        </div>

        {/* Intent */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Intent</p>
          <TagInput
            value={(intent ?? []) as string[]}
            onChange={(v) =>
              onIntentChange(
                v.length ? toIntentArray(v) : undefined
              )
            }
            placeholder="learn, share, network..."
            badgeClassName="bg-blue-500 text-white"
          />
        </div>
      </CardContent>
    </Card>
  );
}
