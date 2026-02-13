'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '../ui/button';
import { Sparkles, StopCircle, RefreshCw, Check, X, Loader2 } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { eventIteratorToStream } from '@orpc/server';
import { client } from '@/lib/orpc';
import { Skeleton } from '../ui/skeleton';
import { Editor } from '@tiptap/react';
import { cn } from '@/lib/utils';

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

  const isStreaming = status === 'streaming';

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
    setTimeout(() => {
      sendMessage({ text: 'Rewrite the content professionally.' });
    }, 50);
  }, [editor, stop, clearError, setMessages, sendMessage]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) startCompose();
    else {
      stop();
      setMessages([]);
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          className="relative h-8 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] active:scale-95"
        >
          <div className="flex h-full w-full items-center gap-2 rounded-full bg-background px-3 hover:bg-background/90">
            <Sparkles className={cn('size-3.5 text-purple-500', isStreaming && 'animate-pulse')} />
            <span className="text-xs font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              AI Rewrite
            </span>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[400px] p-0 overflow-hidden border-border/50 shadow-2xl rounded-2xl"
        align="end"
        sideOffset={12}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-muted/20 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80">
              Intelligence System
            </span>
          </div>
          {isStreaming && (
            <Button size="icon" variant="ghost" className="size-6 text-destructive" onClick={stop}>
              <StopCircle size={14} />
            </Button>
          )}
        </div>

        <div className="p-4 min-h-[120px] max-h-[350px] overflow-y-auto scrollbar-thin">
          {error ? (
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
              <p className="text-xs text-destructive font-mono px-4">{error.message}</p>
              <Button size="sm" variant="outline" onClick={startCompose} className="h-8 gap-2">
                <RefreshCw size={12} /> Retry
              </Button>
            </div>
          ) : composeText ? (
            <div className="relative">
              <p className="text-sm leading-relaxed text-foreground/90 font-medium whitespace-pre-wrap animate-in fade-in duration-500">
                {composeText}
                {isStreaming && (
                  <span className="inline-block w-1 h-4 ml-1 bg-purple-500 animate-bounce" />
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-3 animate-spin" />
                <span className="text-[10px] uppercase font-bold tracking-tighter">
                  Analyzing Context...
                </span>
              </div>
              <Skeleton className="h-3 w-[90%] rounded-full opacity-50" />
              <Skeleton className="h-3 w-[100%] rounded-full opacity-40" />
              <Skeleton className="h-3 w-[70%] rounded-full opacity-30" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/40 px-3 py-3 bg-muted/10">
          <Button
            size="sm"
            variant="ghost"
            className="text-[10px] uppercase font-bold tracking-wider hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setOpen(false)}
          >
            Discard
          </Button>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={isStreaming || !composeText}
              onClick={startCompose}
              className="h-8 gap-2 border-dashed"
            >
              <RefreshCw size={12} className={cn(isStreaming && 'animate-spin')} />
              <span className="text-xs">Regenerate</span>
            </Button>

            <Button
              size="sm"
              disabled={isStreaming || !composeText}
              onClick={() => {
                onAccept?.(composeText);
                setOpen(false);
              }}
              className="h-8 gap-2 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20"
            >
              <Check size={12} />
              <span className="text-xs font-bold">Replace Content</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
