import { Dialog, DialogTitle } from '@radix-ui/react-dialog';
import { DialogContent, DialogHeader } from '../ui/dialog';
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
          className="
    border-2 border-dashed border-border rounded-xl 
    bg-muted/30 p-12 cursor-pointer
    transition-all duration-200
    hover:border-primary/50 hover:bg-muted/50
    ut-uploading:opacity-90 
    ut-uploading:cursor-wait
    ut-uploading:bg-muted
    ut-upload-icon:text-primary 
    ut-upload-icon:cusror-pointer
    ut-label:text-foreground ut-label:text-base ut-label:font-semibold ut-label:mt-4
    ut-allowed-content:text-muted-foreground ut-allowed-content:text-sm ut-allowed-content:mt-2
    ut-button:bg-primary ut-button:text-primary-foreground 
    ut-button:px-6 ut-button:py-2.5 ut-button:rounded-lg 
    ut-button:text-sm ut-button:font-medium ut-button:mt-4
    ut-button:hover:bg-primary/90 
    ut-button:transition-colors
    ut-button:shadow-sm
  "
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
