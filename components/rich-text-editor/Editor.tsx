'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import { editorExtension } from './extension';
import { MenuBar } from './MenuBar';

export function RichTextEditor() {
  const editor = useEditor({
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    extensions: editorExtension,
    editorProps: {
      attributes: {
        class:
          'min-h-[125px] max-w-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none dark:prose-invert p-4',
      },
    },
  });

  return (
    <div className="relative w-full border border-input rounded-lg overflow-hidden dark:bg-input/30 flex flex-col">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
