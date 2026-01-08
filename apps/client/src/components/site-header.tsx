"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./genaral/themeToggler";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { IconDotsVertical } from "@tabler/icons-react";

export function SiteHeader({
  user,
}: {
  user: { name?: string | null; email: string; image?: string | null };
}) {
  const displayName =
    user.name && user.name.trim().length > 0
      ? user.name
      : user.email.split("@")[0];
  const avatarSrc = user.image ?? `https://avatar.vercel.sh/${user.email}`;
  const fallbackChar =
    (displayName && displayName.length > 0
      ? displayName.charAt(0)
      : user.email.charAt(0)
    ).toUpperCase();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={avatarSrc} alt={displayName} />
              <AvatarFallback className="rounded-lg">
                {fallbackChar}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {displayName}
              </span>
            </div>
            <IconDotsVertical className="ml-auto size-4" />
          </SidebarMenuButton>
        </div>
      </div>
    </header>
  );
}
