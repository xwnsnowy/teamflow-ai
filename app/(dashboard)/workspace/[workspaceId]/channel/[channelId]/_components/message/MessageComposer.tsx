import { RichTextEditor } from '@/components/rich-text-editor/Editor';
import { Button } from '@/components/ui/button';
import { ImageIcon, Send } from 'lucide-react';

interface MessageComposerProps {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  isPending?: boolean;
}

export function MessageComposer({ value, onChange, onSubmit, isPending }: MessageComposerProps) {
  return (
    <>
      <RichTextEditor
        field={{ value, onChange }}
        sendButton={
          <Button disabled={isPending} type="button" size="sm" onClick={onSubmit}>
            <Send className="size-4 mr-1" />
            {isPending ? 'Sending...' : 'Send'}
          </Button>
        }
        footerLeft={
          <Button size="sm" variant="outline">
            <ImageIcon className="size-4 mr-1" />
            Attach
          </Button>
        }
      />
    </>
  );
}
