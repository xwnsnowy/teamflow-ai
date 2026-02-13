'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { orpc } from '@/lib/orpc';
import { cn } from '@/lib/utils';
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components';
import { useSuspenseQuery } from '@tanstack/react-query';

// Bảng màu nhẹ nhàng, tinh tế hơn
const colorCombinations = [
  'bg-blue-100 text-blue-700 hover:bg-blue-200',
  'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  'bg-purple-100 text-purple-700 hover:bg-purple-200',
  'bg-orange-100 text-orange-700 hover:bg-orange-200',
  'bg-rose-100 text-rose-700 hover:bg-rose-200',
  'bg-slate-100 text-slate-700 hover:bg-slate-200',
];

const getWorkspaceColor = (workspaceId: string) => {
  const charSum = workspaceId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const colorIndex = charSum % colorCombinations.length;
  return colorCombinations[colorIndex];
};

export function WorkspaceList() {
  const {
    data: { workspaces, currentWorkspace },
  } = useSuspenseQuery(orpc.workspace.list.queryOptions());

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-col gap-3 py-4 items-center">
        {workspaces.map((workspace) => {
          const isActive = currentWorkspace.orgCode === workspace.id;
          const colorStyles = getWorkspaceColor(workspace.id);

          return (
            <Tooltip key={workspace.id}>
              <TooltipTrigger asChild>
                <div className="relative">
                  {/* Thanh chỉ báo đơn giản bên cạnh */}
                  {isActive && (
                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-6 bg-foreground rounded-r-full" />
                  )}

                  <LoginLink orgCode={workspace.id}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'size-11 rounded-xl transition-all duration-200 p-0 font-bold text-sm',
                        colorStyles,
                        isActive
                          ? 'ring-2 ring-foreground ring-offset-2 scale-100'
                          : 'opacity-70 hover:opacity-100 hover:scale-105',
                      )}
                    >
                      {workspace.avatar}
                    </Button>
                  </LoginLink>
                </div>
              </TooltipTrigger>

              <TooltipContent side="right" className="font-medium">
                {workspace.name} {isActive && '(Đang chọn)'}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
