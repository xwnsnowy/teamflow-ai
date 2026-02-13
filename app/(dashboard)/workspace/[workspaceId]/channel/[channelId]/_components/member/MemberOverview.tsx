'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { orpc } from '@/lib/orpc';
import { useQuery } from '@tanstack/react-query';
import { Search, Users, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MemberItem } from './MemberItem';
import { Skeleton } from '@/components/ui/skeleton';
import { usePresence } from '@/hooks/use-presence';
import { useParams } from 'next/navigation';
import { User } from '@/schemas/realtime';
import { cn } from '@/lib/utils';

export function MemberOverview() {
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: members, isLoading, error } = useQuery(orpc.workspace.member.list.queryOptions());
  const { data: workspaces } = useQuery(orpc.workspace.list.queryOptions());

  const currentUser = useMemo(() => {
    if (!workspaces?.user) return null;
    return {
      id: workspaces.user.id,
      full_name: workspaces.user.given_name + ' ' + workspaces.user.family_name,
      email: workspaces.user.email,
      picture: workspaces.user.picture,
    } satisfies User;
  }, [workspaces?.user]);

  const workspaceId = params.workspaceId as string;
  const { onlineUsers } = usePresence({
    room: `workspace-${workspaceId}`,
    currentUser: currentUser,
  });

  const onlineUserIds = useMemo(() => new Set(onlineUsers.map((u) => u.id)), [onlineUsers]);

  const filteredMembers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members ?? [];
    return (members ?? []).filter(
      (m) => m.full_name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q),
    );
  }, [members, search]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            'h-8 gap-2 px-2 hover:bg-muted transition-all',
            open && 'bg-muted text-primary',
          )}
        >
          <div className="flex -space-x-2">
            <Users size={14} className="text-muted-foreground" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest leading-none">
            {members?.length ?? 0}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[300px] p-0 rounded-xl shadow-2xl border-border/50 overflow-hidden"
      >
        <div className="p-3 bg-muted/30 flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Personnel Overview
          </span>
          <div className="flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono text-muted-foreground">
              {onlineUsers.length} Online
            </span>
          </div>
        </div>

        <div className="p-2 border-b border-border/40">
          <div className="relative group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Filter by name or email..."
              className="pl-8 h-8 text-xs bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/30"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Member List */}
        <div className="max-h-72 overflow-y-auto scrollbar-thin">
          {error ? (
            <div className="p-8 text-center">
              <p className="text-xs text-destructive font-mono italic">DATA_FETCH_ERROR</p>
            </div>
          ) : isLoading ? (
            <div className="p-2 space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="size-8 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-8 text-center opacity-40 italic">
              <p className="text-[10px] uppercase tracking-tighter">No assets found</p>
            </div>
          ) : (
            <div className="p-1 space-y-0.5">
              {filteredMembers.map((member) => (
                <MemberItem
                  key={member.id}
                  member={member}
                  isOnline={!!member.id && onlineUserIds.has(member.id)}
                />
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
