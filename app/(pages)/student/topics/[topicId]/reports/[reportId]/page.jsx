"use client";

import { useState, useEffect, useRef } from "react";
import { Button, message } from "antd";
import { SectionEditor } from "./section-editor";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { useParams } from "next/navigation";
import { getReportById, updateReportSection } from "@/service/reportService";
import { useDebounce } from "@/hooks/use-debounce";
import { getSections } from "@/service/sectionService";
import { Room } from "./room";
import { CheckCircleIcon, DownloadIcon, LoaderIcon } from "lucide-react";
import { Avatars } from "./avatars";
import { ReportPdfTemplate } from "./report-pdf-template";
import html2pdf from "html2pdf.js";

export default function ReportPage() {
  const params = useParams();
  const reportId = params.reportId;

  const pdfRef = useRef();

  const [report, setReport] = useState();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msgApi, contextHolder] = message.useMessage();
  const [savingStatus, setSavingStatus] = useState("idle");

  const loadReport = async () => {
    const res = await getReportById(reportId);
    setReport(await res.json());
  };

  const loadSection = async () => {
    const res = await getSections();
    setSections(res);
  };

  useEffect(() => {
    if (!reportId) return;

    const loadData = async () => {
      await Promise.all([loadReport(), loadSection()]);
    };

    loadData();
  }, [reportId]);

  useEffect(() => {
    if (!report || !sections) return;
    setLoading(false);
  }, [report, sections]);

  const handleExportPdf = () => {
    const pdf = document.querySelector("#report-pdf-template");

    const formatString = (str) => {
      return str
        .replace(/\s+/g, "") // Remove all spaces
        .replace(/^(.)/, (match) => match.toUpperCase()) // Capitalize the first letter
        .replace(/ (.)/g, (match) => match.toUpperCase()) // Capitalize letters after spaces
        .replace(/([A-Z])/g, (match) => match.toLowerCase()) // Convert all letters to lowercase
        .replace(/^(.)/, (match) => match.toUpperCase()); // Capitalize the first letter again
    };

    html2pdf()
      .from(pdf)
      .set({
        margin: [15, 0, 15, 0],
        filename: `NCKH-SV.${
          report.studentId.studentId
        }.BaoCaoNT.${formatString(report.topicId.vietnameseName)}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      })
      .save();
  };

  const handleContentChange = useDebounce(async (id, newContent) => {
    try {
      const currentSection = report?.sections?.find(
        (sec) => sec.templateId === id
      );
      if (currentSection && currentSection.content === newContent) {
        return;
      }
      setSavingStatus("saving");
      setSections((prev) => {
        const updatedSections = prev.map((sec) =>
          sec._id === id ? { ...sec, content: newContent } : sec
        );
        return updatedSections;
      });

      await updateReportSection(reportId, id, newContent);
      loadReport();
      setSavingStatus("saved");
    } catch (error) {
      console.error("Error updating content:", error);
      setSavingStatus("idle");
    }
  }, 1000);

  if (loading) {
    return <FullscreenLoader label="Loading" />;
  }

  return (
    <Room>
      {contextHolder}
      <div className="relative">
        <form className="p-6 space-y-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold h-9">Báo cáo</h1>
              <Avatars />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 text-sm text-gray-600 border border-gray-200 rounded-full bg-gray-50">
                {savingStatus === "saving" ? (
                  <>
                    <LoaderIcon className="size-3.5 animate-spin" />
                    <span className="text-xs">Đang lưu...</span>
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="size-3.5" />
                    <span className="text-xs">Đã lưu lên máy chủ</span>
                  </>
                )}
              </div>
              <Button
                type="primary"
                onClick={handleExportPdf}
                disabled={savingStatus === "saving"}
              >
                {savingStatus === "saving" ? (
                  <LoaderIcon className="size-4 animate-spin" />
                ) : (
                  <DownloadIcon className="size-4" />
                )}
                Xuất báo cáo
              </Button>
              <div className="hidden">
                <ReportPdfTemplate
                  ref={pdfRef}
                  owner={report?.studentId}
                  instructor={report?.instructorId}
                  topic={report?.topicId}
                  sections={report?.sections}
                />
              </div>
            </div>
          </div>

          {sections.map((sec) => {
            const reportSection = report?.sections?.find(
              (reportSec) => reportSec._id === sec._id
            );

            return (
              <div key={sec._id} className="space-y-2">
                <label
                  htmlFor={`section-${sec._id}`}
                  className="block text-base font-medium"
                >
                  {sec.title}
                </label>

                <div
                  id={`section-${sec._id}`}
                  className="border border-gray-200 rounded min-h-[150px]"
                >
                  <SectionEditor
                    field={sec._id}
                    initialContent={reportSection?.content || ""}
                    onChange={(newHtml) =>
                      handleContentChange(sec._id, newHtml)
                    }
                    savingStatus={savingStatus}
                  />
                </div>
              </div>
            );
          })}
        </form>
      </div>
    </Room>
  );
}
