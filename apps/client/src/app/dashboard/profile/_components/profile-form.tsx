"use client";

import { useEffect, useState } from "react";
import { ProfileHeaderCard, type Mood } from "./profile-header-card";
import { PreferencesCard } from "./preferences-card";
import { BasicInfoCard } from "./basic-info-card";
import { PrivacySettingsDialog, type PrivacySettings, type ProfileVisibility, type ContentPreferences, type CommunityPreferences } from "./privacy-settings-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  getMyProfileAction,
  updateMyProfileAction,
} from "@/actions/dashboard/profile";
import type { Intent } from "@/actions/dashboard/profile/schema";

// Default privacy settings
const DEFAULT_CONTENT_PREFERENCES: ContentPreferences = {
  textPosts: true,
  shortVideos: false,
  longVideos: false,
  liveSessions: false,
  voiceChat: true,
  fileSharing: true,
  events: false,
};

const DEFAULT_COMMUNITY_PREFERENCES: CommunityPreferences = {
  beginnerFriendly: true,
  seriousOnly: false,
  casual: true,
  strictModeration: true,
  smallGroups: true,
  largeCommunities: false,
};

export function ProfileForm() {
  const [loading, setLoading] = useState(true);

  const [mood, setMood] = useState<Mood | undefined>(undefined);
  const [interests, setInterests] = useState<string[] | undefined>(undefined);
  const [intent, setIntent] = useState<Intent[] | undefined>(undefined);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    allowDMs: true,
    profileVisibility: "server_only",
    contentPreferences: DEFAULT_CONTENT_PREFERENCES,
    communityPreferences: DEFAULT_COMMUNITY_PREFERENCES,
  });
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const profile = await getMyProfileAction();
        if (!alive) return;

        setMood((profile?.mood as Mood | undefined) ?? undefined);
        setInterests((profile?.interests as string[] | undefined) ?? undefined);
        setIntent((profile?.intent as Intent[] | undefined) ?? undefined);

        setDisplayName(profile?.displayName ?? "");
        setUsername(profile?.username ?? "");
        setPronouns(profile?.pronouns ?? "");
        setBio(profile?.bio ?? "");

        // Load privacy settings
        setPrivacySettings({
          allowDMs: profile?.allowDMs ?? true,
          profileVisibility: (profile?.profileVisibility as ProfileVisibility) ?? "server_only",
          contentPreferences: (profile?.contentPreferences as ContentPreferences) ?? DEFAULT_CONTENT_PREFERENCES,
          communityPreferences: (profile?.communityPreferences as CommunityPreferences) ?? DEFAULT_COMMUNITY_PREFERENCES,
        });
      } catch (e) {
        console.error(e);
        toast.error("Failed to load profile");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  async function saveProfile() {
    setSaving(true);
    try {
      const res = await updateMyProfileAction({
        mood,
        interests,
        intent,

        displayName: displayName.trim() || undefined,
        username: username.trim() || undefined,
        pronouns: pronouns.trim() || undefined,
        bio: bio.trim() || undefined,

        // Privacy settings
        allowDMs: privacySettings.allowDMs,
        profileVisibility: privacySettings.profileVisibility,
        contentPreferences: privacySettings.contentPreferences,
        communityPreferences: privacySettings.communityPreferences,
      });

      if (!res.ok) throw new Error(res.error);
      toast.success("Profile saved");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to save profile";
      toast.error(msg);
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-40 w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-48 w-full animate-pulse rounded-xl bg-muted" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileHeaderCard mood={mood} onMoodChange={setMood} />

      <BasicInfoCard
        displayName={displayName}
        onDisplayNameChange={setDisplayName}
        username={username}
        onUsernameChange={setUsername}
        pronouns={pronouns}
        onPronounsChange={setPronouns}
        bio={bio}
        onBioChange={setBio}
        onPrivacyClick={() => setPrivacyDialogOpen(true)}
      />

      <PreferencesCard
        interests={interests}
        onInterestsChange={setInterests}
        intent={intent}
        onIntentChange={setIntent}
      />

      <Button onClick={saveProfile} disabled={saving} className="w-full">
        {saving ? "Saving..." : "Save profile"}
      </Button>

      <PrivacySettingsDialog
        open={privacyDialogOpen}
        onOpenChange={setPrivacyDialogOpen}
        settings={privacySettings}
        onSettingsChange={setPrivacySettings}
      />
    </div>
  );
}
