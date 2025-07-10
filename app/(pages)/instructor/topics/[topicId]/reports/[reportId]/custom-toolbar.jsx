import { useParams } from "next/navigation";
import { useState } from "react";
import parse from "html-react-parser";
import { Toolbar } from "@liveblocks/react-tiptap";
import { Button, Dropdown, Modal, Drawer, Card, App, Divider } from "antd";
import { Icon } from "@liveblocks/react-ui";
import { getReportById, semanticSearchReports } from "@/service/reportService";
import { ArrowRightIcon } from "lucide-react";

export const CustomToolbar = ({ editor, savingStatus, field }) => {
  const params = useParams();
  const reportId = params.reportId;

  const [open, setOpen] = useState(false);
  const { message } = App.useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});
  const [comparisonData, setComparisonData] = useState({
    original: "",
    modified: "",
    selection: null,
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

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

  const handleSemanticSearch = async () => {
    try {
      const content = editor.getText();
      if (!content.trim()) {
        message.error("Vui lòng nhập nội dung trước khi tìm kiếm.");
        return;
      }
      setIsLoading(true);
      const res = await semanticSearchReports(field, reportId);
      const data = await res.json();
      setSearchResults(data);
      setIsDrawerOpen(true);
    } catch (error) {
      message.error("Lỗi khi tìm kiếm báo cáo " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (action) => {
    const { view, state } = editor;
    const { selection } = state;
    const { from, to } = selection;
    const text = view.state.doc.textBetween(from, to, "\n");
    if (!text) {
      message.error("Chọn nội dung cần sửa đổi.");
      return;
    }

    const originalHtml = text
      .split("\n")
      .map((line) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return "<br>";
        return `<p class="mb-2 leading-relaxed">${trimmedLine}</p>`;
      })
      .join("");

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
          original: originalHtml,
          modified: outputText,
          selection: { from, to },
        });
        setIsModalOpen(true);
      })
      .catch((error) => {
        message.error("Lỗi khi sửa đổi nội dung.");
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

  const handleViewReport = async (reportId) => {
    const res = await getReportById(reportId);
    if (res.ok) {
      const data = await res.json();
      setSelectedReport(data);
      setIsReportModalOpen(true);
    } else {
      message.error("Lỗi khi lấy thông tin báo cáo");
    }
  };

  return (
    <>
      <Toolbar editor={editor} className="border-b-[1px] border-gray-200">
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
        <Toolbar.Button
          disabled={savingStatus === "saving"}
          icon={<Icon.Search />}
          name="Semantic Search"
          onClick={handleSemanticSearch}
        >
          <span className="mr-1">Semantic Search</span>
        </Toolbar.Button>
        <Toolbar.BlockSelector />
        <Toolbar.SectionInline />
        <Toolbar.Separator />
        <Toolbar.SectionCollaboration />
      </Toolbar>

      <Drawer
        title="Kết quả tìm kiếm tương tự"
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        width={600}
      >
        <div className="space-y-4">
          {searchResults.map((result, index) => (
            <Card key={index} className="shadow-sm">
              <div className="space-y-3">
                {result.topic && (
                  <div className="pb-2 border-b border-gray-100">
                    <h4 className="mb-1 font-semibold text-blue-600">
                      {result.topic.vietnameseName}
                    </h4>
                    <p className="mb-1 text-sm text-gray-600">
                      {result.topic.englishName}
                    </p>
                    <div className="flex gap-4 items-center text-xs text-gray-500">
                      <span>Loại: {result.topic.type || "N/A"}</span>
                      <span>
                        Thời gian:{" "}
                        {new Date(result.topic.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {result.template && (
                  <div className="flex justify-between pb-2 border-b border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {result.template.order}. {result.template.title}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">
                        Điểm tương đồng: {(result.score * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="max-w-none prose tiptap h-[150px] overflow-y-hidden relative">
                  <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-white to-transparent" />
                  {parse(result.content)}
                </div>

                <div className="flex justify-end pt-2 border-t border-gray-100">
                  <Button
                    type="text"
                    size="small"
                    onClick={() => {
                      handleViewReport(result.reportId);
                    }}
                  >
                    Xem báo cáo
                    <ArrowRightIcon className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Drawer>

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
            <div className="tiptap p-4 bg-gray-50 rounded min-h-[200px] prose prose-sm max-w-none">
              {parse(comparisonData.original)}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Nội dung đã sửa</h3>
            <div className="tiptap p-4 bg-blue-50 rounded min-h-[200px] prose prose-sm max-w-none">
              {parse(comparisonData.modified)}
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        title="Thông tin báo cáo"
        open={isReportModalOpen}
        onCancel={() => setIsReportModalOpen(false)}
        width={1200}
        centered
        footer={[
          <Button key="close" onClick={() => setIsReportModalOpen(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedReport && (
          <div className="space-y-4">
            <div className="pb-4">
              <Divider orientation="center">Thông tin đề tài</Divider>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Tên tiếng Việt:</span>
                  <p className="text-gray-700">
                    {selectedReport.topicId?.vietnameseName}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Tên tiếng Anh:</span>
                  <p className="text-gray-700">
                    {selectedReport.topicId?.englishName}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Loại đề tài:</span>
                  <p className="text-gray-700">
                    {selectedReport.topicId?.type || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <Divider orientation="center">Nội dung báo cáo</Divider>
            <div>
              {selectedReport.sections.map((section, index) => (
                <div key={`selected-report-section-${index}`}>
                  {section.templateId && (
                    <h3 className="mb-2 text-lg font-semibold text-gray-800">
                      {section.templateId.order}. {section.templateId.title}
                    </h3>
                  )}
                  <div className="p-4 bg-gray-50 rounded-lg tiptap">
                    {parse(section.content)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {isLoading && (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-lg">
            <div className="w-12 h-12 rounded-full border-4 border-blue-500 animate-spin border-t-transparent" />
            <p className="mt-4 font-medium text-gray-700">
              AI đang xử lý yêu cầu của bạn...
            </p>
          </div>
        </div>
      )}
    </>
  );
};
