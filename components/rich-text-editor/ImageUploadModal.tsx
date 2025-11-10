import { Dialog, DialogTitle } from '@radix-ui/react-dialog';
import { DialogContent, DialogHeader } from '../ui/dialog';

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Upload, Link as LinkIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { UploadDropzone } from '@/lib/uploadthing';
import { toast } from 'sonner';

interface ImageUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded: (url: string) => void;
}

export default function ImageUploadModal({
  open,
  onOpenChange,
  onUploaded,
}: ImageUploadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Insert Image</DialogTitle>
        </DialogHeader>
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            const url = res[0]?.ufsUrl;
            if (!url) {
              toast.error('Upload failed: No URL returned');
              return;
            }
            toast.success('Image uploaded successfully!');
            onUploaded(url);
          }}
          onUploadError={(error: Error) => {
            toast.error(`Upload failed: ${error.message}`);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
