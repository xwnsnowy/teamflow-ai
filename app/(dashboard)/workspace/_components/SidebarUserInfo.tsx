'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getAvatar } from '@/lib/get-avatar';
import { orpc } from '@/lib/orpc';
import { LogoutLink, PortalLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CreditCard, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';

export function SidebarUserInfo() {
  const {
    data: { user },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions());

  const fullName = `${user.given_name} ${user.family_name}`;
  const initials = ((user.given_name?.[0] ?? 'X') + (user.family_name?.[0] ?? '')).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-10 rounded-full p-0 hover:bg-muted transition-all"
        >
          <Avatar className="size-10 border border-border/50">
            <Image
              src={getAvatar(user.picture, user.email || 'anonymous')}
              alt={fullName}
              fill
              sizes="40px"
              className="object-cover"
            />
            <AvatarFallback className="text-xs bg-secondary">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="right"
        sideOffset={12}
        className="w-64 p-2 rounded-xl shadow-lg border-border/50"
      >
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none">{fullName}</p>
            <p className="text-xs leading-none text-muted-foreground truncate italic">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem asChild className="cursor-pointer rounded-md py-2">
            <PortalLink className="flex w-full items-center gap-2">
              <Settings size={14} className="text-muted-foreground" />
              <span className="text-sm">Account Settings</span>
            </PortalLink>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer rounded-md py-2">
            <PortalLink className="flex w-full items-center gap-2">
              <CreditCard size={14} className="text-muted-foreground" />
              <span className="text-sm">Billing</span>
            </PortalLink>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-2" />

        <DropdownMenuItem
          asChild
          className="cursor-pointer rounded-md py-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogoutLink className="flex w-full items-center gap-2">
            <LogOut size={14} />
            <span className="text-sm font-medium">Log out</span>
          </LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
