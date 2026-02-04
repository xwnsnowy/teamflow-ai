import { editorExtension } from '@/components/rich-text-editor/extension';
import { generateJSON } from '@tiptap/react';
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: false, linkify: true, breaks: true });

export function markdownToJson(markdown: string) {
  const html = md.render(markdown);

  const cleanHTML = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });

  return generateJSON(cleanHTML, editorExtension);
}
