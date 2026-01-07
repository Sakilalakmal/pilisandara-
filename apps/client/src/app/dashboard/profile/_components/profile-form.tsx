"use client";

import { useState } from "react";
import { ProfileHeaderCard, type Mood } from "./profile-header-card";
import { PreferencesCard } from "./preferences-card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateMyProfileAction } from "@/actions/dashboard/profile";
import type { Intent } from "@/actions/dashboard/profile/schema";

export function ProfileForm() {
  const [mood, setMood] = useState<Mood | undefined>(undefined);
  const [interests, setInterests] = useState<string[] | undefined>(undefined);
  const [intent, setIntent] = useState<Intent[] | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  async function saveProfile() {
    setSaving(true);
    try {
      const res = await updateMyProfileAction({
        mood,
        interests,
        intent,
      });

      if (!res.ok) throw new Error(res.error);
      toast.success("Profile saved");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <ProfileHeaderCard mood={mood} onMoodChange={setMood} />

      <PreferencesCard
        interests={interests}
        onInterestsChange={setInterests}
        intent={intent}
        onIntentChange={setIntent}
      />

      <Button
        onClick={saveProfile}
        disabled={saving}
        className="w-full"
      >
        {saving ? "Saving..." : "Save profile"}
      </Button>
    </div>
  );
}
