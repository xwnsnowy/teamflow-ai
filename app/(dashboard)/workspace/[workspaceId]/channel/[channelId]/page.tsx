'use client';

import { useParams } from 'next/navigation';
import { ChannelHeader } from './_components/ChannelHeader';
import { MessageInputForm } from './_components/message/MessageInputForm';
import { MessagesList } from './_components/MessagesList';
import { useQuery } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs';

const ChannelPageMain = () => {
  const { channelId } = useParams<{ channelId: string }>();

  const { data, error, isLoading } = useQuery(
    orpc.channel.get.queryOptions({
      input: {
        channelId: channelId,
      },
    }),
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex h-screen w-full">
      <div className="flex flex-col flex-1 min-w-0">
        {/* Fixed Header */}
        <ChannelHeader />

        {/* Scorll message area */}
        <div className="flex-1 overflow-y-auto mb-4">
          <MessagesList />
        </div>

        {/*Fixed Ipnut area */}
        <div className="border-t bg-background p-4">
          <MessageInputForm
            channelId={channelId}
            user={data?.currentUser as KindeUser<Record<string, unknown>>}
          />
        </div>
      </div>
    </div>
  );
};

export default ChannelPageMain;
