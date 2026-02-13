import React from 'react';
import { WorkspaceList } from './_components/WorkspaceList';
import { CreateWorkspace } from './_components/CreateWorkspace';
import { SidebarUserInfo } from './_components/SidebarUserInfo';
import { WorkspaceSidebar } from './_components/WorkspaceSidebar';
import { orpc } from '@/lib/orpc';
import { getQueryClient, HydrateClient } from '@/lib/query/hydration';

const WorkspaceLayout = async ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(orpc.workspace.list.queryOptions());

  return (
    <div className="flex w-full h-screen">
      <WorkspaceSidebar
        workspaceList={
          <HydrateClient client={queryClient}>
            <WorkspaceList />
          </HydrateClient>
        }
        createWorkspace={<CreateWorkspace />}
        sidebarUserInfo={
          <HydrateClient client={queryClient}>
            <SidebarUserInfo />
          </HydrateClient>
        }
      />
      {children}
    </div>
  );
};

export default WorkspaceLayout;
