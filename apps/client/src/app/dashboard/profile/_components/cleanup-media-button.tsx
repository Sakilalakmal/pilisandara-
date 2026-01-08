"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cleanupMyInvalidMediaAction } from "@/actions/dashboard/profile/cleanup";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";

/**
 * Quick fix button to clean up invalid media storage IDs
 * Add this temporarily to your profile page to fix the current issue
 */
export function CleanupMediaButton() {
  const [loading, setLoading] = useState(false);

  async function handleCleanup() {
    setLoading(true);
    try {
      const result = await cleanupMyInvalidMediaAction();
      toast.success(result.message);
      
      // Reload the page to fetch fresh data
      window.location.reload();
    } catch (error) {
      console.error("Cleanup failed:", error);
      toast.error("Failed to cleanup invalid media");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleCleanup}
      disabled={loading}
      variant="outline"
      size="sm"
    >
      {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
      Clean Up Invalid Images
    </Button>
  );
}
