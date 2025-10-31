import React from 'react';
import { WorkspaceHeader } from './_components/WorkspaceHeader';
import { CreateNewChannel } from './_components/CreateNewChannel';

const ChannelListLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full w-80 flex-col bg-secondary border-r border-border">
      <div className="flex items-center px-4 h-14 border-b border-border">
        <WorkspaceHeader />
      </div>

      <div className="px-4 py-2">
        <CreateNewChannel />
      </div>
    </div>
  );
};

export default ChannelListLayout;
