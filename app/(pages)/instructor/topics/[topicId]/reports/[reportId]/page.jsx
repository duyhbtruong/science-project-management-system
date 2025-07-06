"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import { SectionEditor } from "./section-editor";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { useParams } from "next/navigation";
import { getReportById, updateReportSection } from "@/service/reportService";
import { useDebounce } from "@/hooks/use-debounce";
import { getSections } from "@/service/sectionService";
import { Room } from "./room";
import { CheckCircleIcon, LoaderIcon } from "lucide-react";
import { Avatars } from "./avatars";

export default function ReportPage() {
  const params = useParams();
  const reportId = params.reportId;

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

  const handleContentChange = useDebounce(async (id, newContent) => {
    try {
      const currentSection = report?.sections?.find((sec) => sec._id === id);
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
            {savingStatus !== "idle" && (
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
            )}
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
