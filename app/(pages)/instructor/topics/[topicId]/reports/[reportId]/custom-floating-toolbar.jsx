import { FloatingToolbar, Toolbar } from "@liveblocks/react-tiptap";

export const CustomFloatingToolbar = ({ editor }) => {
  return (
    <FloatingToolbar editor={editor} position="bottom">
      <Toolbar.SectionHistory />
      <Toolbar.Separator />
      <Toolbar.BlockSelector />
      <Toolbar.SectionInline />
      <Toolbar.Separator />
      <Toolbar.SectionCollaboration />
    </FloatingToolbar>
  );
};
