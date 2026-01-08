"use client";

import { ProfileCompletionCard } from "@/components/onboarding";

export function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Onboarding gate - shows completion card if profile is incomplete */}
      <div className="px-4 pt-4 lg:px-6">
        <ProfileCompletionCard />
      </div>

      {/* Main content */}
      {children}
    </>
  );
}
