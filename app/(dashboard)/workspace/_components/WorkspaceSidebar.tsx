'use client';

import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

type WorkspaceSidebarProps = {
  workspaceList: ReactNode;
  createWorkspace: ReactNode;
  sidebarUserInfo: ReactNode;
};

export function WorkspaceSidebar({
  workspaceList,
  createWorkspace,
  sidebarUserInfo,
}: WorkspaceSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative h-full">
      <div
        className={cn(
          'relative flex h-full flex-col bg-secondary py-3 border-r border-border transition-all duration-200 ease-out overflow-hidden',
          isCollapsed ? 'w-0 px-0 border-r-0' : 'w-16 px-2 items-center',
        )}
      >
        {!isCollapsed && (
          <>
            {workspaceList}
            <div className="mt-4">{createWorkspace}</div>

            <div className="mt-auto">{sidebarUserInfo}</div>
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
          isCollapsed ? 'left-2' : 'left-[52px]',
        )}
        aria-label={isCollapsed ? 'Open workspace sidebar' : 'Collapse workspace sidebar'}
      >
        {isCollapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
      </Button>
    </div>
  );
}
