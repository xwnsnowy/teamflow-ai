import { Editor } from '@tiptap/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Toggle } from '../ui/toggle';
import { Bold, Code, Italic, Strikethrough } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuBarProps {
  editor: Editor | null;
}

export function MenuBar({ editor }: MenuBarProps) {
  if (!editor) {
    return null;
  }
  return (
    <div className="border border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive('bold')}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                className={cn(editor.isActive('bold') && 'bg-muted text-muted-foreground')}
              >
                <Bold />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent side="top">Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive('italic')}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                className={cn(editor.isActive('italic') && 'bg-muted text-muted-foreground')}
              >
                <Italic />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent side="top">Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive('strike')}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                className={cn(editor.isActive('strike') && 'bg-muted text-muted-foreground')}
              >
                <Strikethrough />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent side="top">Strikethrough</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={editor.isActive('codeBlock')}
                onPressedChange={() => editor.chain().focus().toggleCodeBlock().run()}
                className={cn(editor.isActive('codeBlock') && 'bg-muted text-muted-foreground')}
              >
                <Code />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent side="top">Code Block</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
