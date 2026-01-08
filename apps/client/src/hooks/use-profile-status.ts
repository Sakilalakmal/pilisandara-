"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useMemo } from "react";

export type ProfileStatus = {
  isLoading: boolean;
  isComplete: boolean;
  percent: number;
  missing: string[];
};

const DEFAULT_STATUS: ProfileStatus = {
  isLoading: false,
  isComplete: false,
  percent: 0,
  missing: ["displayName", "username", "avatar"],
};

/**
 * Hook to get current user's profile completion status
 * Reusable across the app for checking profile completeness
 * Uses Convex reactive queries for automatic updates
 */
export function useProfileStatus(): ProfileStatus {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const userId = session?.user?.id;

  const status = useQuery(
    api.users.getMyProfileStatus,
    userId ? { userId } : "skip"
  );

  return useMemo(() => {
    // Loading state
    if (sessionLoading || status === undefined) {
      return {
        isLoading: true,
        isComplete: false,
        percent: 0,
        missing: [],
      };
    }

    // No session or no status
    if (!userId || !status) {
      return DEFAULT_STATUS;
    }

    return {
      isLoading: false,
      isComplete: status.isComplete,
      percent: status.percent,
      missing: status.missing,
    };
  }, [sessionLoading, status, userId]);
}
