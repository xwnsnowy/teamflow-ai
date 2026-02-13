'use client';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sparkles, StopCircle, RefreshCw, Copy, Check, BrainCircuit } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import { eventIteratorToStream } from '@orpc/client';
import { client } from '@/lib/orpc';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface SummarizeThreadProps {
  messageId: string;
}

function getFriendlyAiErrorMessage(errorMessage?: string) {
  const normalized = errorMessage?.toLowerCase() ?? '';

  if (
    normalized.includes('429') ||
    normalized.includes('rate limit') ||
    normalized.includes('rate-limited') ||
    normalized.includes('too many requests')
  ) {
    return 'AI đang bị giới hạn (429). Vui lòng thử lại sau ít phút.';
  }

  return errorMessage || 'Đã có lỗi xảy ra. Vui lòng thử lại.';
}

export function SummarizeThread({ messageId }: SummarizeThreadProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { messages, status, error, sendMessage, setMessages, stop, clearError } = useChat({
    id: `thread-summary:${messageId}`,

    transport: {
      async sendMessages(options) {
        return eventIteratorToStream(
          await client.ai.thread.summary.generate(
            {
              messageId,
            },

            { signal: options.abortSignal },
          ),
        );
      },

      reconnectToStream() {
        throw new Error('Reconnecting to thread summary stream is not supported.');
      },
    },
  });

  const lastAssistantMessage = messages.findLast((msg) => msg.role === 'assistant');
  const summaryText =
    lastAssistantMessage?.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('') || '';

  const isStreaming = status === 'streaming';

  const onCopy = () => {
    if (!summaryText) return;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    toast.success('Summary copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      stop();
      clearError();
      setMessages([]);
      // Đợi popover render xong rồi mới gửi request
      setTimeout(() => {
        sendMessage({ text: 'Summarize this thread.' });
      }, 100);
    } else {
      stop();
      setMessages([]);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 px-3 rounded-full hover:bg-violet-500/10 hover:text-violet-600 transition-all group"
        >
          <Sparkles
            className={cn(
              'size-3.5 text-muted-foreground group-hover:text-violet-500 transition-colors',
              isStreaming && 'animate-pulse text-violet-500',
            )}
          />
          <span className="text-xs font-bold uppercase tracking-widest">Summarize</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[380px] p-0 overflow-hidden border-border/50 shadow-2xl rounded-2xl"
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="size-5 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <BrainCircuit className="size-3 text-violet-600" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Thread Synthesis
            </span>
          </div>
          {isStreaming && (
            <Button size="icon" variant="ghost" className="size-6 text-destructive" onClick={stop}>
              <StopCircle size={14} />
            </Button>
          )}
        </div>

        <div className="p-5 max-h-[320px] overflow-y-auto scrollbar-thin">
          {error ? (
            <div className="py-4 text-center space-y-3">
              <p className="text-xs text-destructive font-mono italic">
                {getFriendlyAiErrorMessage(error.message)}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => sendMessage({ text: 'Summarize' })}
                className="h-8 gap-2"
              >
                <RefreshCw size={12} /> Retry
              </Button>
            </div>
          ) : summaryText ? (
            <div className="prose prose-sm dark:prose-invert">
              <p className="text-sm leading-relaxed text-foreground/90 font-medium whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 duration-500">
                {summaryText}
                {isStreaming && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-violet-500 animate-pulse align-middle" />
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              <div className="flex items-center gap-2 opacity-50">
                <RefreshCw className="size-3 animate-spin text-violet-500" />
                <span className="text-[10px] uppercase font-bold tracking-tighter">
                  Reading messages...
                </span>
              </div>
              <Skeleton className="h-3 w-[85%] rounded-full opacity-40" />
              <Skeleton className="h-3 w-[100%] rounded-full opacity-30" />
              <Skeleton className="h-3 w-[60%] rounded-full opacity-20" />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/40 px-3 py-3 bg-muted/10">
          <Button
            size="sm"
            variant="ghost"
            className="text-[10px] font-bold uppercase tracking-wider"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>

          <div className="flex gap-2">
            {summaryText && !isStreaming && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-2 border-dashed"
                onClick={onCopy}
              >
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                <span className="text-xs">{copied ? 'Copied' : 'Copy'}</span>
              </Button>
            )}

            <Button
              size="sm"
              variant="default"
              disabled={isStreaming}
              onClick={() => {
                setMessages([]);
                sendMessage({ text: 'Summarize' });
              }}
              className="h-8 gap-2 bg-violet-600 hover:bg-violet-700 shadow-lg shadow-violet-500/20"
            >
              <RefreshCw size={12} className={cn(isStreaming && 'animate-spin')} />
              <span className="text-xs font-bold">Refresh</span>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
