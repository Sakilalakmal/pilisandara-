"use client";

import { ProfileCompletionCard } from "@/components/profile";

export function DashboardContent({
  userId,
  children,
}: {
  userId: string;
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Onboarding gate - shows completion card if profile is incomplete */}
      <ProfileCompletionCard userId={userId} />

      {/* Main content */}
      {children}
    </>
  );
}
