import React from 'react';
import { WorkspaceList } from './_components/WorkspaceList';

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full h-screen">
      <div className="flex h-full w-16 flex-col items-center bg-secondary py-3 px-2 border-r border-border">
        <WorkspaceList />
      </div>
    </div>
  );
};

export default WorkspaceLayout;
