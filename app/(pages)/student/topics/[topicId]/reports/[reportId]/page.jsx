"use client";

import { useState, useEffect, useRef } from "react";
import { Button, App } from "antd";
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
import { uploadFile } from "@/service/uploadService";

export default function ReportPage() {
  const params = useParams();
  const reportId = params.reportId;
  const { message } = App.useApp();
  const pdfRef = useRef();

  const [report, setReport] = useState();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const handleExportPdf = async () => {
    const html2pdf = require("html2pdf.js");
    const pdf = document.querySelector("#report-pdf-template");

    const formatString = (str) => {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
    };

    const fileName = `NCKH-SV.${
      report.studentId.studentId
    }.BaoCaoNT.${formatString(report.topicId.vietnameseName)}.pdf`;

    let startDate = new Date(report.topicId.registrationPeriod.startDate);
    let endDate = new Date(report.topicId.registrationPeriod.endDate);
    startDate = startDate.toISOString().slice(0, 10).replace(/-/g, "");
    endDate = endDate.toISOString().slice(0, 10).replace(/-/g, "");
    const periodDir = `${report.topicId.registrationPeriod.title}-${startDate}-${endDate}`;

    const pdfBlob = await html2pdf()
      .from(pdf)
      .set({
        margin: [15, 0, 15, 0],
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      })
      .outputPdf("blob");

    const submitFile = new File([pdfBlob], fileName, {
      type: "application/pdf",
    });

    const formData = new FormData();
    formData.append("file", submitFile);
    formData.append("fileType", "submit");
    formData.append("fileName", fileName);
    formData.append("periodDir", periodDir);
    formData.append("studentId", report.studentId.studentId);

    const res = await uploadFile(report.topicId._id, formData);
    if (res.ok) {
      const data = await res.json();
      message.open({
        type: "success",
        content: data.message,
        duration: 2,
      });
      window.open(data.fileUrl, "_blank");
    } else {
      const data = await res.json();
      message.open({
        type: "error",
        content: data.message,
        duration: 2,
      });
    }
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
      <div className="relative">
        <form className="p-6 space-y-6 bg-white rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-3 items-center">
              <h1 className="h-9 text-2xl font-bold">Báo cáo</h1>
              <Avatars />
            </div>
            <div className="flex gap-3 items-center">
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
                  <LoaderIcon className="animate-spin size-4" />
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
                <span className="block text-base font-medium">{sec.title}</span>

                <div className="border border-gray-200 rounded min-h-[150px]">
                  <SectionEditor
                    field={sec._id}
                    initialContent={reportSection?.content ?? ""}
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
