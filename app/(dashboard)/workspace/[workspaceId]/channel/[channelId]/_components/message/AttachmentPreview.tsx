import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { X } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export function AttachmentPreview({ url, onRemove }: { url: string; onRemove: () => void }) {
  const handleRemove = () => {
    onRemove();

    toast.success('Your image has been removed from the message');
  };

  return (
    <div className="flex items-center gap-2 p-1.5 pr-2 bg-muted/50 rounded-lg border border-border group hover:bg-muted transition-colors">
      <div className="relative size-10 rounded overflow-hidden">
        <Image src={url} alt="Attachment" fill className="object-cover" sizes="40px" />
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleRemove}
              size="icon"
              variant="ghost"
              type="button"
              className="size-6 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="size-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Remove attachment</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
