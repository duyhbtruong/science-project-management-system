"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  useLiveblocksExtension,
  FloatingToolbar,
} from "@liveblocks/react-tiptap";
import { Threads } from "./threads";
import { CustomToolbar } from "./custom-tool-bar";
import "@liveblocks/react-tiptap/styles.css";
import "@liveblocks/react-ui/styles.css";

export const SectionEditor = ({ initialContent, onChange, field }) => {
  const liveblocks = useLiveblocksExtension({ field, initialContent });
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[100px]",
      },
    },
    extensions: [
      liveblocks,
      StarterKit.configure({
        history: false,
      }),
    ],
    content: ``,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div>
      <EditorContent editor={editor} />
      <CustomToolbar editor={editor} />
      <Threads editor={editor} />
    </div>
  );
};
