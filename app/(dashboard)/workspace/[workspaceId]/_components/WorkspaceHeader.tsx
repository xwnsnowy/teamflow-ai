'use client';

import { orpc } from '@/lib/orpc';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ChevronDown, LayoutGrid } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function WorkspaceHeader() {
  const {
    data: { currentWorkspace },
  } = useSuspenseQuery(orpc.channel.list.queryOptions());

  return (
    <div className="px-4 py-3 border-b border-border/40">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 w-full group transition-all outline-hidden">
            {/* Logo thu nhỏ của Workspace */}
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              {currentWorkspace?.orgName?.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col items-start min-w-0 flex-1">
              <h2 className="text-[14px] font-bold truncate leading-tight text-foreground/90 group-hover:text-foreground">
                {currentWorkspace.orgName}
              </h2>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider leading-none mt-1">
                Workspace Node
              </span>
            </div>

            <ChevronDown
              size={14}
              className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0"
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-56 rounded-xl shadow-xl border-border/50">
          <div className="px-2 py-1.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            Workspace Settings
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer gap-2 py-2">
            <LayoutGrid size={14} />
            <span className="text-sm">Manage Apps</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2 py-2">
            <div className="size-2 rounded-full bg-primary" />
            <span className="text-sm">Workspace Analytics</span>
          </DropdownMenuItem>
          {/* Thêm các Action khác ở đây */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
