'use client';

import { orpc } from '@/lib/orpc';
import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function ChannelsList() {
  const {
    data: { channels },
  } = useSuspenseQuery(orpc.channel.list.queryOptions());

  const { workspaceId, channelId } = useParams<{ workspaceId: string; channelId: string }>();

  return (
    <div className="space-y-1 py-1">
      {channels.map((channel) => {
        const isActive = channel.id === channelId;
        return (
          <Link
            key={channel.id}
            href={`/workspace/${workspaceId}/channel/${channel.id}`}
            className={`flex justify-start items-center px-2 py-1 text-sm font-mono font-medium rounded-md border hover:text-foreground hover:bg-teal-700 transition-colors duration-200 ${
              isActive ? 'text-accent-foreground bg-blue-500' : 'text-muted-foreground '
            }`}
          >
            <span className="truncate">#{channel.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
