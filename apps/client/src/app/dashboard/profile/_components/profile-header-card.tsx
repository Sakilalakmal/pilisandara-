"use client";

import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2Icon, CameraIcon, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  generateAvatarUploadUrlAction,
  generateCoverUploadUrlAction,
  setAvatarAction,
  setCoverAction,
} from "@/actions/dashboard/profile/media";
import { toast } from "sonner";

export type Mood = { label: string; emoji?: string };

const MOODS: Mood[] = [
  { label: "Focused", emoji: "🔥" },
  { label: "Chill", emoji: "😌" },
  { label: "Grinding", emoji: "⚡" },
  { label: "Curious", emoji: "🤔" },
  { label: "Busy", emoji: "⏳" },
];

async function uploadToConvex(
  file: File,
  getUrl: () => Promise<string>
): Promise<string> {
  const uploadUrl = await getUrl();

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(uploadUrl, { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");

  const json = (await res.json()) as { storageId: string };
  return json.storageId;
}

export function ProfileHeaderCard({
  mood,
  onMoodChange,
}: {
  mood?: Mood;
  onMoodChange: (m: Mood) => void;
}) {
  const [uploading, setUploading] = useState<"avatar" | "cover" | null>(null);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  async function handleAvatar(file: File) {
    setUploading("avatar");
    try {
      const fileId = await uploadToConvex(
        file,
        generateAvatarUploadUrlAction
      );
      await setAvatarAction(fileId);
      toast.success("Avatar updated");
    } catch {
      toast.error("Avatar update failed");
    } finally {
      setUploading(null);
    }
  }

  async function handleCover(file: File) {
    setUploading("cover");
    try {
      const fileId = await uploadToConvex(
        file,
        generateCoverUploadUrlAction
      );
      await setCoverAction(fileId);
      toast.success("Cover updated");
    } catch {
      toast.error("Cover update failed");
    } finally {
      setUploading(null);
    }
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Cover */}
      <div className="relative h-36 w-full bg-muted">
        <div className="absolute right-4 top-4">
          <Button
            size="sm"
            variant="secondary"
            className="gap-2"
            onClick={() => coverInputRef.current?.click()}
            disabled={uploading !== null}
          >
            {uploading === "cover" ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
            Change cover
          </Button>
        </div>
      </div>

      <CardContent className="relative pt-0">
        <div className="-mt-10 flex items-end gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-20 w-20 border">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>

            {/* Camera button – RIGHT CENTER */}
            <Button
              size="icon"
              variant="secondary"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full"
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploading !== null}
            >
              {uploading === "avatar" ? (
                <Loader2Icon className="h-4 w-4 animate-spin" />
              ) : (
                <CameraIcon className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Text */}
          <div className="pb-2">
            <p className="text-lg font-semibold">Your profile</p>
            <p className="text-sm text-muted-foreground">
              Customize your identity for Pilisandara.
            </p>
          </div>
        </div>

        {/* Mood – RIGHT CENTER */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button">
                <Badge className="px-3 py-1 text-sm">
                  {mood?.emoji ? `${mood.emoji} ` : ""}
                  {mood?.label ?? "Set mood"}
                </Badge>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {MOODS.map((m) => (
                <DropdownMenuItem
                  key={m.label}
                  onClick={() => onMoodChange(m)}
                >
                  {m.emoji ? `${m.emoji} ` : ""}
                  {m.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>

      {/* Hidden inputs */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleAvatar(f);
          e.currentTarget.value = "";
        }}
      />

      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleCover(f);
          e.currentTarget.value = "";
        }}
      />
    </Card>
  );
}
