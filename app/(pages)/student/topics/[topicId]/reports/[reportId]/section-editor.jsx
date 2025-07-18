"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import { Threads } from "./threads";
import { CustomToolbar } from "./custom-toolbar";
import { CustomFloatingToolbar } from "./custom-floating-toolbar";
import "@liveblocks/react-tiptap/styles.css";
import "@liveblocks/react-ui/styles.css";

export const SectionEditor = ({
  initialContent,
  onChange,
  field,
  savingStatus,
}) => {
  const liveblocks = useLiveblocksExtension({ field, initialContent });
  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[100px] p-3",
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
      <CustomToolbar
        editor={editor}
        savingStatus={savingStatus}
        field={field}
      />
      <EditorContent editor={editor} spellCheck={false} />
      <CustomFloatingToolbar editor={editor} />
      <Threads editor={editor} />
    </div>
  );
};
