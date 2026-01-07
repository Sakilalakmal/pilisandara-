import {
  BookmarkIcon,
  ChevronDownIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useSignout } from "@/hooks/use-sign-out";

interface UserDropDownProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export function UserDropDown({ name, email, image }: UserDropDownProps) {
  const { handleSignOut } = useSignout();

  const fallback = name?.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-auto gap-2 p-0 hover:bg-transparent"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={image ?? undefined} alt="Profile image" />
            <AvatarFallback>{fallback}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon size={16} className="opacity-60" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">{name ?? "User"}</span>
          <span className="truncate text-xs text-muted-foreground">
            {email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile" className="flex items-center gap-2">
              <UserIcon size={16} className="opacity-60" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/dashboard/saved" className="flex items-center gap-2">
              <BookmarkIcon size={16} className="opacity-60" />
              <span>Saved</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOutIcon size={16} className="opacity-60" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
