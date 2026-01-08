"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useMemo } from "react";

export type ProfileStatus = {
  loading: boolean;
  isComplete: boolean;
  percent: number;
  missing: string[];
};

const DEFAULT_STATUS: ProfileStatus = {
  loading: false,
  isComplete: false,
  percent: 0,
  missing: ["displayName", "username", "avatar"],
};

/**
 * Hook to get current user's profile completion status
 * Reusable across the app for checking profile completeness
 * Uses Convex reactive queries for automatic updates
 */
export function useProfileStatus(userId?: string): ProfileStatus {
  const status = useQuery(
    api.users.getMyProfileStatus,
    userId ? { userId } : "skip"
  );

  return useMemo(() => {
    if (!userId) return DEFAULT_STATUS;

    if (status === undefined) {
      return { ...DEFAULT_STATUS, loading: true, missing: [] };
    }

    return {
      loading: false,
      isComplete: status.isComplete,
      percent: status.percent,
      missing: status.missing,
    };
  }, [status, userId]);
}
