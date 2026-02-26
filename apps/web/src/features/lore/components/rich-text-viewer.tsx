import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

interface RichTextViewerProps {
  content: unknown;
}

export function RichTextViewer({ content }: RichTextViewerProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: { class: 'text-violet-600 underline' },
      }),
    ],
    content: (content as Record<string, unknown>) ?? null,
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none',
      },
    },
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}
