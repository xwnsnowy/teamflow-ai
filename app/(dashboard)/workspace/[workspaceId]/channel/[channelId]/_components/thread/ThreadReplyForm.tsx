'use client';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { createMessageChannelSchema, CreateMessageChannelType } from '@/schemas/message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { MessageComposer } from '../message/MessageComposer';
import { useAttachmentUpload } from '@/lib/use-attachment-upload';
import { useState } from 'react';

export function ThreadReplyForm() {
  const { channelId } = useParams<{ channelId: string }>();

  const upload = useAttachmentUpload();

  const [editorKey, setEditorKey] = useState(0);

  const form = useForm({
    resolver: zodResolver(createMessageChannelSchema),
    defaultValues: {
      content: '',
      channelId: channelId,
    },
  });

  function onSubmit(data: CreateMessageChannelType) {
    console.log(data);
  }

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MessageComposer
                  value={field.value}
                  onChange={field.onChange}
                  upload={upload}
                  key={editorKey}
                  onSubmit={() => onSubmit(form.getValues())}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
