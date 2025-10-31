import Link from 'next/link';

const channelList = [
  {
    id: '1',
    name: 'general',
  },
  {
    id: '2',
    name: 'random',
  },
  {
    id: '3',
    name: 'development',
  },
];

export function ChannelList() {
  return (
    <div className="space-y-1 py-1">
      {channelList.map((channel) => (
        <Link
          key={channel.id}
          href={`/workspace/${channel.id}/channel/${channel.id}`}
          className="flex justify-start items-center px-2 py-1 text-sm font-mono font-medium rounded-md border text-muted-foreground hover:text-foreground hover:bg-teal-700 transition-colors duration-200"
        >
          <span className="truncate">@{channel.name}</span>
        </Link>
      ))}
    </div>
  );
}
