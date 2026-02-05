import { ThemeToggle } from '@/components/ui/theme-toggle';
import InviteMember from './member/InviteMember';
import { MemberOverview } from './member/MemberOverview';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs';

interface ChannelHeaderProps {
  channel: {
    channelName: string;
    currentUser: KindeUser<Record<string, unknown>>;
  };
}

export function ChannelHeader({ channel }: ChannelHeaderProps) {
  return (
    <div className="w-full border-b border-border px-4 py-2 h-14 flex items-center justify-between">
      <h1 className="text-lg font-semibold">#{channel.channelName}</h1>
      <div className="flex items-center space-x-2">
        <MemberOverview />
        <InviteMember />
        <ThemeToggle />
      </div>
    </div>
  );
}
