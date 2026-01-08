"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export type ProfileVisibility = "public" | "server_only" | "private";

export type ContentPreferences = {
  textPosts: boolean;
  shortVideos: boolean;
  longVideos: boolean;
  liveSessions: boolean;
  voiceChat: boolean;
  fileSharing: boolean;
  events: boolean;
};

export type CommunityPreferences = {
  beginnerFriendly: boolean;
  seriousOnly: boolean;
  casual: boolean;
  strictModeration: boolean;
  smallGroups: boolean;
  largeCommunities: boolean;
};

export type PrivacySettings = {
  allowDMs: boolean;
  profileVisibility: ProfileVisibility;
  contentPreferences: ContentPreferences;
  communityPreferences: CommunityPreferences;
};

interface PrivacySettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: PrivacySettings;
  onSettingsChange: (settings: PrivacySettings) => void;
}

export function PrivacySettingsDialog({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}: PrivacySettingsDialogProps) {
  const updateContentPreference = (key: keyof ContentPreferences, value: boolean) => {
    onSettingsChange({
      ...settings,
      contentPreferences: {
        ...settings.contentPreferences,
        [key]: value,
      },
    });
  };

  const updateCommunityPreference = (key: keyof CommunityPreferences, value: boolean) => {
    onSettingsChange({
      ...settings,
      communityPreferences: {
        ...settings.communityPreferences,
        [key]: value,
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Privacy Settings</AlertDialogTitle>
          <AlertDialogDescription>
            Manage your privacy preferences and control how you interact with the community.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Visibility */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="profileVisibility" className="text-base font-semibold">
                Profile Visibility
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Control who can see your profile
              </p>
            </div>
            <Select
              value={settings.profileVisibility}
              onValueChange={(value: ProfileVisibility) =>
                onSettingsChange({ ...settings, profileVisibility: value })
              }
            >
              <SelectTrigger id="profileVisibility">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  <div>
                    <div className="font-medium">Public</div>
                    <div className="text-xs text-muted-foreground">
                      Anyone can see your profile
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="server_only">
                  <div>
                    <div className="font-medium">Server Only</div>
                    <div className="text-xs text-muted-foreground">
                      Only server members can see your profile
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="private">
                  <div>
                    <div className="font-medium">Private</div>
                    <div className="text-xs text-muted-foreground">
                      Only you can see your full profile
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Allow DMs */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="allowDMs" className="text-base font-semibold">
                Allow Direct Messages
              </Label>
              <p className="text-sm text-muted-foreground">
                Let other users send you direct messages
              </p>
            </div>
            <Switch
              id="allowDMs"
              checked={settings.allowDMs}
              onCheckedChange={(checked) =>
                onSettingsChange({ ...settings, allowDMs: checked })
              }
            />
          </div>

          <Separator />

          {/* Content Preferences */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Content Preferences</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Types of content you prefer to engage with
              </p>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="textPosts" className="font-normal">
                  Text Posts
                </Label>
                <Switch
                  id="textPosts"
                  checked={settings.contentPreferences.textPosts}
                  onCheckedChange={(checked) => updateContentPreference("textPosts", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="shortVideos" className="font-normal">
                  Short Videos
                </Label>
                <Switch
                  id="shortVideos"
                  checked={settings.contentPreferences.shortVideos}
                  onCheckedChange={(checked) => updateContentPreference("shortVideos", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="longVideos" className="font-normal">
                  Long Videos
                </Label>
                <Switch
                  id="longVideos"
                  checked={settings.contentPreferences.longVideos}
                  onCheckedChange={(checked) => updateContentPreference("longVideos", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="liveSessions" className="font-normal">
                  Live Sessions
                </Label>
                <Switch
                  id="liveSessions"
                  checked={settings.contentPreferences.liveSessions}
                  onCheckedChange={(checked) => updateContentPreference("liveSessions", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="voiceChat" className="font-normal">
                  Voice Chat
                </Label>
                <Switch
                  id="voiceChat"
                  checked={settings.contentPreferences.voiceChat}
                  onCheckedChange={(checked) => updateContentPreference("voiceChat", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="fileSharing" className="font-normal">
                  File Sharing
                </Label>
                <Switch
                  id="fileSharing"
                  checked={settings.contentPreferences.fileSharing}
                  onCheckedChange={(checked) => updateContentPreference("fileSharing", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="events" className="font-normal">
                  Events
                </Label>
                <Switch
                  id="events"
                  checked={settings.contentPreferences.events}
                  onCheckedChange={(checked) => updateContentPreference("events", checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Community Preferences */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-semibold">Community Preferences</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Types of communities you prefer to join
              </p>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="beginnerFriendly" className="font-normal">
                  Beginner Friendly
                </Label>
                <Switch
                  id="beginnerFriendly"
                  checked={settings.communityPreferences.beginnerFriendly}
                  onCheckedChange={(checked) =>
                    updateCommunityPreference("beginnerFriendly", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="seriousOnly" className="font-normal">
                  Serious Only
                </Label>
                <Switch
                  id="seriousOnly"
                  checked={settings.communityPreferences.seriousOnly}
                  onCheckedChange={(checked) =>
                    updateCommunityPreference("seriousOnly", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="casual" className="font-normal">
                  Casual
                </Label>
                <Switch
                  id="casual"
                  checked={settings.communityPreferences.casual}
                  onCheckedChange={(checked) => updateCommunityPreference("casual", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="strictModeration" className="font-normal">
                  Strict Moderation
                </Label>
                <Switch
                  id="strictModeration"
                  checked={settings.communityPreferences.strictModeration}
                  onCheckedChange={(checked) =>
                    updateCommunityPreference("strictModeration", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="smallGroups" className="font-normal">
                  Small Groups
                </Label>
                <Switch
                  id="smallGroups"
                  checked={settings.communityPreferences.smallGroups}
                  onCheckedChange={(checked) =>
                    updateCommunityPreference("smallGroups", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="largeCommunities" className="font-normal">
                  Large Communities
                </Label>
                <Switch
                  id="largeCommunities"
                  checked={settings.communityPreferences.largeCommunities}
                  onCheckedChange={(checked) =>
                    updateCommunityPreference("largeCommunities", checked)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction onClick={() => onOpenChange(false)}>
            Done
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
