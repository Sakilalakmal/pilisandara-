"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  IconCamera,
  IconCheck,
  IconChevronRight,
  IconChevronLeft,
  IconLoader2,
} from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../../convex/_generated/dataModel";

// Intent options from schema
const INTENT_OPTIONS = [
  { value: "learn", label: "Learn new things", emoji: "📚" },
  { value: "share", label: "Share knowledge", emoji: "💡" },
  { value: "network", label: "Network with others", emoji: "🤝" },
  { value: "find_friends", label: "Find friends", emoji: "👋" },
  { value: "get_help", label: "Get help", emoji: "🆘" },
  { value: "teach", label: "Teach others", emoji: "🎓" },
] as const;

type IntentValue = (typeof INTENT_OPTIONS)[number]["value"];

interface OnboardingStepperModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  { title: "Profile Photo", required: true },
  { title: "Your Identity", required: true },
  { title: "About You", required: false },
] as const;

export function OnboardingStepperModal({
  open,
  onOpenChange,
}: OnboardingStepperModalProps) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  // Steps state
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [selectedIntents, setSelectedIntents] = useState<IntentValue[]>([]);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Convex mutations - using direct Convex for proper reactivity
  const upsertProfile = useMutation(api.profiles.upsertMe);
  const setAvatar = useMutation(api.profiles_media.setAvatar);
  const generateUploadUrl = useMutation(api.upload.generateAvatarUploadUrl);

  // Convex queries - reactive data
  const profile = useQuery(api.profiles.getMe, userId ? { userId } : "skip");
  const mediaUrls = useQuery(
    api.profiles_media.getMediaUrls,
    userId ? { userId } : "skip"
  );

  // Derived state
  const avatarUrl = mediaUrls?.avatarUrl ?? null;

  // Initialize form with existing data when profile loads
  useEffect(() => {
    if (profile && open) {
      setDisplayName(profile.displayName || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setSelectedIntents((profile.intent as IntentValue[]) || []);
    }
  }, [profile, open]);

  // Reset step when modal closes
  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
    }
  }, [open]);

  // Avatar upload handler - using Convex directly
  const handleAvatarUpload = useCallback(
    async (file: File) => {
      if (!userId) return;

      // Validate file
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      setAvatarUploading(true);
      try {
        // Get upload URL from Convex
        const uploadUrl = await generateUploadUrl({});

        // Upload file to Convex storage
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const { storageId } = await response.json();

        // Save to profile using Convex mutation (reactive)
        await setAvatar({
          userId,
          fileId: storageId as Id<"_storage">,
        });

        toast.success("Avatar updated!");
      } catch (error) {
        console.error("Avatar upload failed:", error);
        toast.error("Failed to upload avatar");
      } finally {
        setAvatarUploading(false);
      }
    },
    [userId, generateUploadUrl, setAvatar]
  );

  // Toggle intent selection
  const toggleIntent = useCallback((intent: IntentValue) => {
    setSelectedIntents((prev) =>
      prev.includes(intent)
        ? prev.filter((i) => i !== intent)
        : [...prev, intent]
    );
  }, []);

  // Check if can proceed to next step
  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 0:
        return !!avatarUrl;
      case 1:
        return displayName.trim() !== "" && username.trim() !== "";
      case 2:
        return true; // Optional step
      default:
        return false;
    }
  }, [currentStep, avatarUrl, displayName, username]);

  // Handle next step
  const handleNext = useCallback(async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await handleComplete();
    }
  }, [currentStep]);

  // Handle back step
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  // Handle skip (for optional step)
  const handleSkip = useCallback(async () => {
    if (currentStep === 2) {
      await handleComplete();
    }
  }, [currentStep]);

  // Handle profile completion
  const handleComplete = async () => {
    if (!userId) return;

    setIsSubmitting(true);
    try {
      await upsertProfile({
        userId,
        displayName: displayName.trim(),
        username: username.trim(),
        bio: bio.trim() || undefined,
        intent: selectedIntents.length > 0 ? selectedIntents : undefined,
      });

      toast.success("Profile complete! 🎉");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save profile";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Memoized step indicator
  const StepIndicator = useMemo(
    () => (
      <div className="flex items-center justify-center gap-2 py-2">
        {STEPS.map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={`
                flex h-8 w-8 items-center justify-center rounded-full
                text-sm font-medium transition-all duration-300
                ${
                  index < currentStep
                    ? "bg-primary text-primary-foreground"
                    : index === currentStep
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "bg-muted text-muted-foreground"
                }
              `}
            >
              {index < currentStep ? (
                <IconCheck className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`
                  h-0.5 w-8 transition-all duration-300
                  ${index < currentStep ? "bg-primary" : "bg-muted"}
                `}
              />
            )}
          </div>
        ))}
      </div>
    ),
    [currentStep]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            {STEPS[currentStep].title}
            {!STEPS[currentStep].required && (
              <span className="text-muted-foreground"> (optional)</span>
            )}
          </DialogDescription>
        </DialogHeader>

        {StepIndicator}

        {/* Step Content */}
        <div className="min-h-[200px] py-4">
          {/* Step 1: Avatar Upload */}
          {currentStep === 0 && (
            <div className="flex flex-col items-center gap-4 animate-in fade-in-0 slide-in-from-right-4 duration-300">
              <div className="relative">
                <Avatar className="h-24 w-24 border-2">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt="Avatar" />}
                  <AvatarFallback className="text-2xl">
                    {displayName?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                >
                  {avatarUploading ? (
                    <IconLoader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <IconCamera className="h-4 w-4" />
                  )}
                </Button>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAvatarUpload(file);
                    e.currentTarget.value = "";
                  }}
                />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Upload a profile photo to help others recognize you
              </p>
            </div>
          )}

          {/* Step 2: Display Name + Username */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="How should we call you?"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a unique username"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  This will be your unique identifier
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Bio + Intent */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-4 duration-300">
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a little about yourself..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label>What are you here for?</Label>
                <div className="flex flex-wrap gap-2">
                  {INTENT_OPTIONS.map((intent) => (
                    <Badge
                      key={intent.value}
                      variant={
                        selectedIntents.includes(intent.value)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer transition-all duration-200 hover:scale-105"
                      onClick={() => toggleIntent(intent.value)}
                    >
                      {intent.emoji} {intent.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
            className="gap-1"
          >
            <IconChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex gap-2">
            {currentStep === 2 && (
              <Button
                variant="ghost"
                onClick={handleSkip}
                disabled={isSubmitting}
              >
                Skip
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed || isSubmitting}
              className="gap-1"
            >
              {isSubmitting ? (
                <IconLoader2 className="h-4 w-4 animate-spin" />
              ) : currentStep === STEPS.length - 1 ? (
                <>
                  Complete
                  <IconCheck className="h-4 w-4" />
                </>
              ) : (
                <>
                  Next
                  <IconChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
