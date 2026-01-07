"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./genaral/themeToggler";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { IconDotsVertical } from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";

export function SiteHeader() {
  const { data: session } = authClient.useSession();
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
              <AvatarImage
                src={
                  session?.user.image ??
                  `https://avatar.vercel.sh/${session?.user.email}`
                }
                alt={session?.user.name ?? ""}
              />
              <AvatarFallback className="rounded-lg">
                {session?.user.name && session.user.name.length > 0
                  ? session.user.name.charAt(0).toUpperCase()
                  : session?.user.email.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {session?.user.name && session.user.name.length > 0
                  ? session.user.name
                  : session?.user.email.split("@")[0]}
              </span>
            </div>
            <IconDotsVertical className="ml-auto size-4" />
          </SidebarMenuButton>
        </div>
      </div>
    </header>
  );
}
