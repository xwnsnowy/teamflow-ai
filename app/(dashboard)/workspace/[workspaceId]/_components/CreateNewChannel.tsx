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
import { channelNameSchema, ChannelNameSchemaType, transformChannelName } from '@/schemas/channel';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function CreateNewChannel() {
  const [open, setOpen] = useState(false);

  const form = useForm<ChannelNameSchemaType>({
    resolver: zodResolver(channelNameSchema),
    defaultValues: {
      name: '',
    },
  });

  const watchWorkspaceName = form.watch('name');
  const transformName = watchWorkspaceName ? transformChannelName(watchWorkspaceName) : '';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="size-4" />
          Add Channel
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>Add a new channel to the workspace</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Channel name" {...field} />
                  </FormControl>
                  {transformName && transformName !== watchWorkspaceName && (
                    <p className="text-sm text-muted-foreground ">
                      Channel name will be created as:
                      <br />
                      <code className="bg-muted px-2 py-1 rounded text-xs text-primary ml-1">
                        {transformName}
                      </code>
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="mt-4 w-full"
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              Create Channel
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
