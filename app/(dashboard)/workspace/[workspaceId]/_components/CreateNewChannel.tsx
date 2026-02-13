'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { orpc } from '@/lib/orpc';
import { channelNameSchema, ChannelNameSchemaType, transformChannelName } from '@/schemas/channel';
import { zodResolver } from '@hookform/resolvers/zod';
import { isDefinedError } from '@orpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Hash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function CreateNewChannel() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<ChannelNameSchemaType>({
    resolver: zodResolver(channelNameSchema),
    defaultValues: { name: '' },
  });

  const createChannelMutation = useMutation(
    orpc.channel.create.mutationOptions({
      onSuccess: (newChannel) => {
        toast.success(`Channel created`);
        queryClient.invalidateQueries({ queryKey: orpc.channel.list.queryKey() });
        setOpen(false);
        form.reset();
        router.push(`/workspace/${newChannel.workspaceId}/channel/${newChannel.id}`);
      },
      onError: (error) => {
        const message = isDefinedError(error) ? error.message : 'Unknown error';
        toast.error(`Error: ${message}`);
      },
    }),
  );

  function onSubmit(values: ChannelNameSchemaType) {
    const transformedName = transformChannelName(values.name);
    createChannelMutation.mutate({ name: transformedName });
  }

  const watchName = form.watch('name');
  const previewName = watchName ? transformChannelName(watchName) : '';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Nút được thiết kế lại theo dạng List Item */}
        <button className="flex items-center gap-2 w-full px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-all group">
          <div className="size-5 flex items-center justify-center rounded bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <Plus className="size-3.5" />
          </div>
          Add Channel
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden rounded-xl border-border/50 shadow-2xl">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Create a channel</DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-widest font-semibold opacity-50">
              Workspace Environment
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 pt-4 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
                    Channel Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative group">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                      <Input
                        placeholder="e.g. marketing-plan"
                        className="pl-9 h-11 bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/40 text-sm font-medium"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  {previewName && previewName !== watchName && (
                    <div className="flex items-center gap-1.5 mt-2 px-1">
                      <span className="text-[10px] text-muted-foreground italic">Will be:</span>
                      <span className="text-[10px] font-mono font-bold text-primary">
                        #{previewName}
                      </span>
                    </div>
                  )}
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20"
              disabled={createChannelMutation.isPending}
            >
              {createChannelMutation.isPending ? 'Syncing...' : 'Confirm Creation'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
