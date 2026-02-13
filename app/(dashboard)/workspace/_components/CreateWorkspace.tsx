'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Loader2, LayoutGrid } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { workspaceSchema, WorkspaceSchemaType } from '@/schemas/workspace';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orpc } from '@/lib/orpc';
import { toast } from 'sonner';
import { isDefinedError } from '@orpc/client';

export function CreateWorkspace() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<WorkspaceSchemaType>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: '',
    },
  });

  const createWorkspaceMutation = useMutation(
    orpc.workspace.create.mutationOptions({
      onSuccess: (newWorkspace) => {
        queryClient.invalidateQueries({
          queryKey: orpc.workspace.list.queryKey(),
        });
        toast.success(`Workspace "${newWorkspace.workspaceName}" initiated`);
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        const message = isDefinedError(error) ? error.message : 'Unknown system error';
        toast.error(`Initialization failed: ${message}`);
      },
    }),
  );

  function onSubmit(values: WorkspaceSchemaType) {
    createWorkspaceMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="size-12 rounded-2xl border-2 border-dashed border-border/60 text-muted-foreground/60 hover:border-primary hover:bg-primary/5 hover:text-primary hover:rounded-xl transition-all duration-300 group"
            >
              <Plus className="size-6 group-hover:rotate-90 transition-transform duration-300" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={10}
          className="font-bold text-[10px] uppercase tracking-widest"
        >
          New Workspace
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-border/50 shadow-2xl">
        <div className="p-6 bg-muted/30 border-b border-border/40">
          <DialogHeader>
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <LayoutGrid size={20} />
            </div>
            <DialogTitle className="text-xl font-bold tracking-tight">Create Workspace</DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-widest font-semibold opacity-50">
              Namespace Initialization
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
                    Workspace Identifier
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Acme Corp, Engineering..."
                      className="h-11 bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/40 text-sm font-medium transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button
                disabled={createWorkspaceMutation.isPending}
                type="submit"
                className="w-full h-11 font-bold uppercase tracking-widest text-xs"
              >
                {createWorkspaceMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  'Launch Workspace'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
