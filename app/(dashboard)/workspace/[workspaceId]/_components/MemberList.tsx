'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { usePresence } from '@/hooks/use-presence';
import { getAvatar } from '@/lib/get-avatar';
import { orpc } from '@/lib/orpc';
import { cn } from '@/lib/utils';
import { User } from '@/schemas/realtime';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { Shield } from 'lucide-react';

export function MemberList() {
  const {
    data: { members },
  } = useSuspenseQuery(orpc.channel.list.queryOptions());

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

  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const { onlineUsers } = usePresence({
    room: `workspace-${workspaceId}`,
    currentUser: currentUser,
  });

  const onlineUserIds = useMemo(() => new Set(onlineUsers.map((user) => user.id)), [onlineUsers]);

  return (
    <div className="flex flex-col gap-0.5 py-2 px-3">
      {/* Section Header Tối giản */}
      <div className="px-2 mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
          Members — {members.length}
        </span>
      </div>

      {members.map((member) => {
        const isOnline = member.id && onlineUserIds.has(member.id);
        const isMe = member.id === currentUser?.id;

        return (
          <div
            key={member.id}
            className="group flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-muted transition-colors duration-200 cursor-pointer"
          >
            <div className="relative flex-shrink-0">
              <Avatar className="size-7 border border-border/50">
                <Image
                  src={getAvatar(member.picture, member.email)}
                  alt={member.full_name || 'User'}
                  fill
                  sizes="28px"
                  className="object-cover"
                />
                <AvatarFallback className="text-[10px] bg-secondary">
                  {member.full_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Status Dot đơn giản */}
              {isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-green-500 border-2 border-background" />
              )}
            </div>

            <div className="flex-1 min-w-0 flex items-center gap-1.5">
              <span
                className={cn(
                  'text-sm truncate transition-colors',
                  isOnline ? 'text-foreground font-medium' : 'text-muted-foreground',
                )}
              >
                {member.full_name}
              </span>

              {isMe && (
                <span className="text-[10px] bg-primary/10 text-primary px-1 rounded font-bold uppercase">
                  You
                </span>
              )}
            </div>

            {isMe && <Shield size={12} className="text-muted-foreground/30" />}
          </div>
        );
      })}
    </div>
  );
}
