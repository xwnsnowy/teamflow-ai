import { useMutation } from '@tanstack/react-query';
import { EmojiReaction } from './EmojiReaction';
import { orpc } from '@/lib/orpc';
import { toast } from 'sonner';
import { GroupedReactionsSchemaType } from '@/schemas/message';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReactionsBarProps {
  messageId: string;
  reactions: GroupedReactionsSchemaType[];
}

export function ReactionsBar({ messageId, reactions }: ReactionsBarProps) {
  const toggleMutation = useMutation(
    orpc.message.reaction.toggle.mutationOptions({
      onSuccess: () => {
        toast.success('Reaction toggled!');
      },
      onError: () => {
        toast.error('Failed to toggle reaction.');
      },
    }),
  );

  const handleToggle = (emoji: string) => {
    toggleMutation.mutate({ emoji, messageId });
  };

  return (
    <div className="mt-1 flex items-center gap-1r">
      {reactions.map((reaction) => (
        <Button
          key={reaction.emoji}
          variant={reaction.reactedByUser ? 'secondary' : 'outline'}
          size="sm"
          className={cn('reaction-button px-2 py-1 cursor-pointer', {
            'bg-secondary text-secondary-foreground': reaction.reactedByUser,
          })}
          onClick={() => handleToggle(reaction.emoji)}
          type="button"
        >
          <span>{reaction.emoji}</span> <span>{reaction.count}</span>
        </Button>
      ))}

      <EmojiReaction onSelect={handleToggle} />
    </div>
  );
}
