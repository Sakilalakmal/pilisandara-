"use client";

import { ProfileForm } from "./profile-form";

export function ProfilePage() {
  return (
    <div className="px-4 py-6 lg:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Customize your profile for better recommendations.
        </p>
      </div>

      <ProfileForm />
    </div>
  );
}
