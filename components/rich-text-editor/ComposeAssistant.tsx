import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { eventIteratorToStream } from '@orpc/server';
import { client } from '@/lib/orpc';
import { Skeleton } from '../ui/skeleton';
import { Editor } from '@tiptap/react';

interface ComposeAssistantProps {
  editor: Editor | null;
  onAccept?: (markdown: string) => void;
}

export function ComposeAssistant({ editor, onAccept }: ComposeAssistantProps) {
  const [open, setOpen] = useState(false);
  const contentForRequestRef = useRef<string>('');

  const { messages, status, error, sendMessage, setMessages, stop, clearError } = useChat({
    id: `compose-assistant`,
    transport: {
      async sendMessages(options) {
        return eventIteratorToStream(
          await client.ai.compose.generate(
            {
              content: contentForRequestRef.current,
            },
            { signal: options.abortSignal },
          ),
        );
      },
      reconnectToStream() {
        throw new Error('Reconnecting to compose assistant stream is not supported.');
      },
    },
  });

  const lastAssistantMessage = messages.findLast((msg) => msg.role === 'assistant');

  const composeText =
    lastAssistantMessage?.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('') || '';

  const startCompose = useCallback(() => {
    if (!editor) return;

    try {
      contentForRequestRef.current = JSON.stringify(editor.getJSON());
    } catch {
      contentForRequestRef.current = '';
    }

    stop();
    clearError();
    setMessages([]);

    // Use setTimeout to ensure state is cleared before sending
    setTimeout(() => {
      sendMessage({ text: 'Compose a rewritten version of the content.' });
    }, 10);
  }, [editor, stop, clearError, setMessages, sendMessage]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      startCompose();
    } else {
      stop();
      clearError();
      setMessages([]);
      contentForRequestRef.current = '';
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          size="sm"
          className="relative overflow-hidden rounded-full bg-gradient-to-t from-violet-600 to-fuchsia-600 text-primary shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 hover:scale-[1.03] active:scale-95"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="size-3.5" />
            <span className="text-xs font-medium">Compose</span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[25rem] p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 py-1.5 px-4 text-xs font-medium text-primary shadow-md gap-1.5">
              <Sparkles className="size-3.5" />
              <span className="text-sm font-medium">Compose (Preview)</span>
            </span>
          </div>
          {status === 'streaming' && (
            <Button
              onClick={() => {
                stop();
              }}
              type="button"
              size="sm"
              variant="outline"
            >
              Stop
            </Button>
          )}
        </div>

        <div className="px-4 py-3 max-h-80 overflow-y-auto">
          {error ? (
            <div>
              <p className="text-sm text-red-600">Error: {error.message}</p>
              <Button
                onClick={() => {
                  clearError();
                  setMessages([]);
                  sendMessage({ text: 'Compose a rewritten version of the content.' });
                }}
                type="button"
                size="sm"
                variant="outline"
                className="m-4 w-full bg-red-600 text-primary hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors duration-200"
              >
                Retry
              </Button>
            </div>
          ) : composeText ? (
            <p className="whitespace-pre-wrap text-sm">{composeText}</p>
          ) : status === 'submitted' || status === 'streaming' ? (
            <div className="space-y-2">
              <p className="text-sm italic text-muted-foreground">Composing...</p>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            <p className="text-sm italic text-muted-foreground">
              Click "Compose" to generate a rewritten version of your content.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t px-3 py-2 bg-muted/30">
          <Button
            type="submit"
            size="sm"
            variant="outline"
            onClick={() => {
              stop();
              clearError();
              setMessages([]);
              setOpen(false);
            }}
          >
            Decline
          </Button>
          <Button
            type="submit"
            size="sm"
            variant="default"
            disabled={!composeText}
            onClick={() => {
              if (!composeText) return;
              onAccept?.(composeText);
              stop();
              clearError();
              setMessages([]);
              setOpen(false);
            }}
          >
            Accept
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
