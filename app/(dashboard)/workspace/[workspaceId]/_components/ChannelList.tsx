'use client';

import { orpc } from '@/lib/orpc';
import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ChannelsList() {
  const {
    data: { channels },
  } = useSuspenseQuery(orpc.channel.list.queryOptions());

  const { workspaceId, channelId } = useParams<{ workspaceId: string; channelId: string }>();

  return (
    <div className="flex flex-col gap-0.5 py-4">
      {/* Header Section */}
      <div className="group flex items-center justify-between px-6 mb-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
          Channels
        </span>
      </div>

      {/* List Section */}
      <nav className="px-3 space-y-[2px]">
        {channels.map((channel) => {
          const isActive = channel.id === channelId;

          return (
            <Link
              key={channel.id}
              href={`/workspace/${workspaceId}/channel/${channel.id}`}
              className={cn(
                'group relative flex items-center gap-3 px-3 py-1.5 rounded-md transition-all duration-200 ease-in-out',
                isActive
                  ? 'bg-primary/10 text-primary shadow-[inset_0_0_0_1px_rgba(var(--primary),0.1)]'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
              )}
            >
              {/* Active Indicator Bar (Dải dọc nhỏ bên cạnh) */}
              {isActive && (
                <div className="absolute left-0 w-[3px] h-4 bg-primary rounded-r-full" />
              )}

              <Hash
                size={14}
                strokeWidth={isActive ? 3 : 2}
                className={cn(
                  'shrink-0 transition-transform duration-200 group-hover:scale-110',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground/40 group-hover:text-muted-foreground',
                )}
              />

              <span
                className={cn(
                  'text-sm truncate transition-colors',
                  isActive ? 'font-bold tracking-tight' : 'font-medium',
                )}
              >
                {channel.name}
              </span>

              {/* Unread dot hoặc Status phụ */}
              {!isActive && (
                <div className="ml-auto size-1 rounded-full bg-foreground/10 group-hover:bg-primary/40 transition-colors" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
