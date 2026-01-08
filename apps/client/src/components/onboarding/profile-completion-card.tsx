"use client";

import { memo, useState, useCallback, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useProfileStatus } from "@/hooks/use-profile-status";
import { OnboardingStepperModal } from "./onboarding-stepper-modal";
import { IconUser, IconAt, IconPhoto, IconSparkles } from "@tabler/icons-react";

const MISSING_LABELS: Record<string, { label: string; icon: React.ReactNode }> =
  {
    displayName: {
      label: "Display name",
      icon: <IconUser className="h-4 w-4" />,
    },
    username: { label: "Username", icon: <IconAt className="h-4 w-4" /> },
    avatar: { label: "Profile photo", icon: <IconPhoto className="h-4 w-4" /> },
  };

// Memoized missing item component
const MissingItem = memo(function MissingItem({ item }: { item: string }) {
  const info = MISSING_LABELS[item];
  if (!info) return null;

  return (
    <div className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
      {info.icon}
      <span>{info.label}</span>
    </div>
  );
});

export function ProfileCompletionCard() {
  const { isLoading, isComplete, percent, missing } = useProfileStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback((open: boolean) => {
    setIsModalOpen(open);
  }, []);

  // Memoize missing items list
  const missingItemsList = useMemo(
    () =>
      missing.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {missing.map((item) => (
            <MissingItem key={item} item={item} />
          ))}
        </div>
      ) : null,
    [missing]
  );

  // Don't render if loading or profile is complete
  if (isLoading || isComplete) {
    return null;
  }

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm animate-in fade-in-0 slide-in-from-top-2 duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconSparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-base font-medium">
                Complete your profile
              </CardTitle>
            </div>
            <span className="text-sm text-muted-foreground">{percent}%</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress bar */}
          <Progress
            value={percent}
            className="h-2 transition-all duration-500 ease-out"
          />

          {/* Missing items */}
          {missingItemsList}

          {/* Finish setup button */}
          <Button
            onClick={handleOpenModal}
            className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            Finish setup
          </Button>
        </CardContent>
      </Card>

      <OnboardingStepperModal
        open={isModalOpen}
        onOpenChange={handleCloseModal}
      />
    </>
  );
}
