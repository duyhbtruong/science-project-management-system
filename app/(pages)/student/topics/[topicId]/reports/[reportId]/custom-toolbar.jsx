import { Toolbar } from "@liveblocks/react-tiptap";
import parse from "html-react-parser";
import { Button, Dropdown, message, Modal } from "antd";
import { useState } from "react";
import { Icon } from "@liveblocks/react-ui";

export const CustomToolbar = ({ editor }) => {
  const [open, setOpen] = useState(false);
  const [msgApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState({
    original: "",
    modified: "",
    selection: null,
  });

  const items = [
    {
      key: "1",
      label: "Rút gọn nội dung",
      onClick: () => handleAction("shorten"),
    },
    {
      key: "2",
      label: "Mở rộng nội dung",
      onClick: () => handleAction("lengthen"),
    },
    {
      key: "3",
      label: "Cải thiện câu chữ",
      onClick: () => handleAction("improve"),
    },
    {
      key: "4",
      label: "Chỉnh sửa ngữ pháp",
      onClick: () => handleAction("fixGrammar"),
    },
  ];

  const handleAction = (action) => {
    const { view, state } = editor;
    const { selection } = state;
    const { from, to } = selection;
    const text = view.state.doc.textBetween(from, to, "\n");
    if (!text) {
      msgApi.error("Chọn nội dung cần sửa đổi.");
      return;
    }

    setIsLoading(true);
    fetch("/api/openai/ask", {
      method: "POST",
      body: JSON.stringify({
        action,
        currentContent: text,
      }),
    })
      .then(async (response) => {
        const { output_text: outputText } = await response.json();
        setComparisonData({
          original: text,
          modified: outputText,
          selection: { from, to },
        });
        setIsModalOpen(true);
      })
      .catch((error) => {
        msgApi.error("Lỗi khi sửa đổi nội dung.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAcceptChanges = () => {
    const { from, to } = comparisonData.selection;
    editor
      ?.chain()
      .focus()
      .insertContentAt({ from, to }, comparisonData.modified, {
        updateSelection: true,
        parseOptions: {
          preserveWhitespace: false,
        },
      })
      .run();
    setIsModalOpen(false);
  };

  const handleRejectChanges = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Toolbar editor={editor}>
        {contextHolder}
        <Dropdown
          menu={{ items }}
          trigger={["click"]}
          onOpenChange={setOpen}
          open={open}
        >
          <Toolbar.Button
            icon={<Icon.Sparkles />}
            name="Ask AI"
            style={{
              color: "oklch(54.6% 0.245 262.881)",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            <span className="mr-1">Ask AI</span>
          </Toolbar.Button>
        </Dropdown>
        <Toolbar.BlockSelector />
        <Toolbar.SectionInline />
        <Toolbar.Separator />
        <Toolbar.SectionCollaboration />
      </Toolbar>

      <Modal
        title="Xem lại thay đổi"
        open={isModalOpen}
        onCancel={handleRejectChanges}
        width={1200}
        centered
        styles={{
          body: {
            maxHeight: "70vh",
            overflowY: "auto",
            padding: "20px",
          },
        }}
        footer={[
          <Button key="reject" onClick={handleRejectChanges}>
            Hủy bỏ
          </Button>,
          <Button type="primary" key="accept" onClick={handleAcceptChanges}>
            Chấp nhận
          </Button>,
        ]}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="mb-2 font-semibold">Nội dung gốc</h3>
            <div className="tiptap p-4 bg-gray-50 rounded min-h-[200px] whitespace-pre-wrap prose">
              {parse(comparisonData.original)}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Nội dung đã sửa</h3>
            <div className="tiptap p-4 bg-blue-50 rounded min-h-[200px] whitespace-pre-wrap prose">
              {parse(comparisonData.modified)}
            </div>
          </div>
        </div>
      </Modal>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
            <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
            <p className="mt-4 font-medium text-gray-700">
              AI đang xử lý yêu cầu của bạn...
            </p>
          </div>
        </div>
      )}
    </>
  );
};
