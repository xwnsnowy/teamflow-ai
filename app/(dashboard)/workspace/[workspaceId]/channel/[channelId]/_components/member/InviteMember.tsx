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
import { orpc } from '@/lib/orpc';
import { inviteMemberSchema, InviteMemberType } from '@/schemas/member';
import { zodResolver } from '@hookform/resolvers/zod';
import { isDefinedError } from '@orpc/client';
import { useMutation } from '@tanstack/react-query';
import { UserPlus, Mail, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function InviteMember() {
  const [open, setOpen] = useState(false);

  const form = useForm<InviteMemberType>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const inviteMemberMutation = useMutation(
    orpc.workspace.member.invite.mutationOptions({
      onSuccess: () => {
        toast.success('Invitation dispatched successfully');
        setOpen(false);
        form.reset();
      },
      onError: (error) => {
        const message = isDefinedError(error) ? error.message : 'Connection failed';
        toast.error(`Invite failed: ${message}`);
      },
    }),
  );

  function onSubmit(values: InviteMemberType) {
    inviteMemberMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 px-3 text-xs font-bold uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all"
        >
          <UserPlus size={14} />
          <span>Invite</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-border/50 shadow-2xl">
        <div className="p-6 bg-muted/30 border-b border-border/40">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">Expand Team</DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-wider font-medium opacity-60">
              Authorized Personnel Only
            </DialogDescription>
          </DialogHeader>
        </div>

        <Form {...form}>
          <form className="p-6 space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase text-muted-foreground/70">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/40 h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[10px] font-black uppercase text-muted-foreground/70">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                        <Input
                          placeholder="name@company.com"
                          className="bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/40 h-10 pl-9"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="w-full h-11 font-bold uppercase tracking-[0.1em] text-xs transition-all active:scale-[0.98]"
                disabled={inviteMemberMutation.isPending}
              >
                {inviteMemberMutation.isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  'Send Invitation'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
