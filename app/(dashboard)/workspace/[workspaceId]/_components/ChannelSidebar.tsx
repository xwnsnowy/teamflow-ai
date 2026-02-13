'use client';

import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

type ChannelSidebarProps = {
  header: ReactNode;
  createChannel: ReactNode;
  channels: ReactNode;
  members: ReactNode;
};

export function ChannelSidebar({ header, createChannel, channels, members }: ChannelSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative h-full">
      <div
        className={cn(
          'flex h-full flex-col bg-secondary border-r border-border transition-all duration-200 ease-out overflow-hidden',
          isCollapsed ? 'w-0 border-r-0' : 'w-80',
        )}
      >
        {!isCollapsed && (
          <>
            <div className="flex items-center px-4 h-14 border-b border-border">{header}</div>

            <div className="px-4 py-2">{createChannel}</div>

            <div className="flex-1 overflow-y-auto px-4">{channels}</div>

            <div className="px-3 py-2 border-t border-border">{members}</div>
          </>
        )}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setIsCollapsed((prev) => !prev)}
        className={cn(
          'absolute top-3 z-10 size-8 border border-border bg-background/80 backdrop-blur-sm',
          isCollapsed ? 'left-2' : 'right-2',
        )}
        aria-label={isCollapsed ? 'Open channel sidebar' : 'Collapse channel sidebar'}
      >
        {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
      </Button>
    </div>
  );
}
