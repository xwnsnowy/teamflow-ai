import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Placeholder } from '@tiptap/extensions/placeholder';

const lowlight = createLowlight(all);

export const baseExtension = [
  StarterKit.configure({
    codeBlock: false,
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
];

export const editorExtension = [
  ...baseExtension,
  Placeholder.configure({
    placeholder: 'Type here...',
  }),
];
