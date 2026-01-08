"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  getMyMediaUrlsAction,
  clearAvatarAction,
  clearCoverAction,
} from "@/actions/dashboard/profile/media";
import { toast } from "sonner";
import Image from "next/image";

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
  // Validate file is an image
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Image must be less than 5MB");
  }

  // Step 1: Get presigned upload URL from Convex
  const uploadUrl = await getUrl();
  
  if (!uploadUrl) {
    throw new Error("Failed to generate upload URL from Convex");
  }

  // Step 2: POST the file directly to the URL
  // According to Convex docs, the file should be sent as the body (not FormData)
  // with the Content-Type header set to the file's MIME type
  const uploadRes = await fetch(uploadUrl, { 
    method: "POST", 
    headers: { "Content-Type": file.type },
    body: file,
  });
  
  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Upload to Convex storage failed: ${uploadRes.status} - ${errorText}`);
  }

  // Step 3: Get storage ID from response
  const uploadJson = (await uploadRes.json()) as { storageId: string };
  
  if (!uploadJson.storageId) {
    throw new Error("No storage ID returned from Convex upload");
  }

  console.log("File uploaded successfully, storage ID:", uploadJson.storageId);
  
  return uploadJson.storageId;
}

export function ProfileHeaderCard({
  mood,
  onMoodChange,
}: {
  mood?: Mood;
  onMoodChange: (m: Mood) => void;
}) {
  const [uploading, setUploading] = useState<"avatar" | "cover" | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  async function refreshMedia() {
    try {
      const res = await getMyMediaUrlsAction();
      // Only set valid URLs (not null or empty)
      const validAvatarUrl = res?.avatarUrl && res.avatarUrl.trim() !== "" ? res.avatarUrl : null;
      const validCoverUrl = res?.coverUrl && res.coverUrl.trim() !== "" ? res.coverUrl : null;
      
      setAvatarUrl(validAvatarUrl);
      setCoverUrl(validCoverUrl);
    } catch (error) {
      console.error("Failed to fetch media URLs:", error);
      toast.error("Failed to load images");
    }
  }

  useEffect(() => {
    void refreshMedia();
  }, []);

  async function handleAvatar(file: File) {
    setUploading("avatar");
    try {
      // Step 1: Upload file to Convex storage
      const fileId = await uploadToConvex(file, generateAvatarUploadUrlAction);
      console.log("Avatar uploaded with ID:", fileId);
      
      // Step 2: Save storage ID to database with retry logic
      let retries = 3;
      let lastError: Error | null = null;
      
      while (retries > 0) {
        try {
          await setAvatarAction(fileId);
          break; // Success!
        } catch (error) {
          lastError = error instanceof Error ? error : new Error("Unknown error");
          retries--;
          if (retries > 0) {
            console.log(`Retrying... (${retries} attempts left)`);
            // Wait a bit before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      if (retries === 0 && lastError) {
        throw new Error(`Failed to save avatar after multiple attempts: ${lastError.message}`);
      }
      
      // Step 3: Refresh to get the new URL
      await refreshMedia();
      toast.success("Avatar updated successfully");
    } catch (e) {
      console.error("Avatar upload error:", e);
      const errorMessage = e instanceof Error ? e.message : "Avatar update failed";
      toast.error(errorMessage);
    } finally {
      setUploading(null);
    }
  }

  async function handleCover(file: File) {
    setUploading("cover");
    try {
      // Step 1: Upload file to Convex storage
      const fileId = await uploadToConvex(file, generateCoverUploadUrlAction);
      console.log("Cover uploaded with ID:", fileId);
      
      // Step 2: Save storage ID to database with retry logic
      let retries = 3;
      let lastError: Error | null = null;
      
      while (retries > 0) {
        try {
          await setCoverAction(fileId);
          break; // Success!
        } catch (error) {
          lastError = error instanceof Error ? error : new Error("Unknown error");
          retries--;
          if (retries > 0) {
            console.log(`Retrying... (${retries} attempts left)`);
            // Wait a bit before retry
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      }
      
      if (retries === 0 && lastError) {
        throw new Error(`Failed to save cover after multiple attempts: ${lastError.message}`);
      }
      
      // Step 3: Refresh to get the new URL
      await refreshMedia();
      toast.success("Cover updated successfully");
    } catch (e) {
      console.error("Cover upload error:", e);
      const errorMessage = e instanceof Error ? e.message : "Cover update failed";
      toast.error(errorMessage);
    } finally {
      setUploading(null);
    }
  }

  return (
    <Card className="relative overflow-hidden">
      {/* Cover */}
      <div className="relative h-36 w-full bg-muted">
        {coverUrl && (
          <Image
            src={coverUrl}
            alt="Cover"
            className="h-full w-full object-cover"
            fill
            sizes="100vw"
            priority
            onError={async () => {
              console.error("Cover image failed to load:", coverUrl);
              setCoverUrl(null);
              try {
                // Clear the invalid storage ID from database
                await clearCoverAction();
                toast.error("Cover image was invalid and has been cleared. Please upload a new one.");
              } catch (error) {
                console.error("Failed to clear invalid cover:", error);
                toast.error("Cover image failed to load");
              }
            }}
          />
        )}

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
              {avatarUrl && (
                <AvatarImage
                  src={avatarUrl}
                  alt="Avatar"
                  onError={async () => {
                    console.error("Avatar image failed to load:", avatarUrl);
                    setAvatarUrl(null);
                    try {
                      // Clear the invalid storage ID from database
                      await clearAvatarAction();
                      toast.error("Avatar image was invalid and has been cleared. Please upload a new one.");
                    } catch (error) {
                      console.error("Failed to clear invalid avatar:", error);
                      toast.error("Avatar image failed to load");
                    }
                  }}
                />
              )}
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
                <DropdownMenuItem key={m.label} onClick={() => onMoodChange(m)}>
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
