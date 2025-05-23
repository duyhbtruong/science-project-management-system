"use client";

import { FloatingToolbar, Toolbar } from "@liveblocks/react-tiptap";
import { Icon } from "@liveblocks/react-ui";
import { Dropdown, message } from "antd";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";

export const CustomToolbar = ({ editor }) => {
  const [open, setOpen] = useState(false);
  const [msgApi, contextHolder] = message.useMessage();

  const handleAction = (action) => {
    const { view, state } = editor;
    const { selection } = state;
    const { from, to } = selection;
    const text = view.state.doc.textBetween(from, to, "\n");
    if (!text) {
      msgApi.error("Chọn nội dung cần sửa đổi.");
      return;
    }

    fetch("/api/openai/ask", {
      method: "POST",
      body: JSON.stringify({
        action,
        currentContent: text,
      }),
    })
      .then(async (response) => {
        const { output_text: outputText } = await response.json();
        editor
          ?.chain()
          .focus()
          .insertContentAt(editor?.state.selection.$anchor.pos, outputText, {
            updateSelection: true,
            parseOptions: {
              preserveWhitespace: false,
            },
          })
          .run();
      })
      .catch((error) => {
        msgApi.error("Lỗi khi sửa đổi nội dung.");
      });
  };

  const items = [
    {
      key: "1",
      label: "Make shorter",
      onClick: () => handleAction("shorten"),
    },
    {
      key: "2",
      label: "Make longer",
      onClick: () => handleAction("lengthen"),
    },
    {
      key: "3",
      label: "Improve writing",
      onClick: () => handleAction("improve"),
    },
    {
      key: "4",
      label: "Fix grammar",
      onClick: () => handleAction("fixGrammar"),
    },
  ];

  // TODO: Fix the issue with the dropdown menu
  return (
    <FloatingToolbar editor={editor}>
      {contextHolder}
      <Dropdown
        menu={{ items }}
        trigger={["click"]}
        onOpenChange={setOpen}
        open={open}
      >
        <Toolbar.Button
          name="AI Assistant"
          icon={<Icon.Sparkles />}
          style={{
            backgroundColor: "oklch(93.2% 0.032 255.585)",
            color: "oklch(54.6% 0.245 262.881)",
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          Ask AI <ChevronDownIcon className="ml-1 size-3" />
        </Toolbar.Button>
      </Dropdown>
      <Toolbar.SectionHistory />
      <Toolbar.Separator />
      <Toolbar.BlockSelector />
      <Toolbar.SectionInline />
      <Toolbar.Separator />
      <Toolbar.SectionCollaboration />
    </FloatingToolbar>
  );
};
