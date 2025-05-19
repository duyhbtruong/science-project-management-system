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

export default function ReportPage() {
  const params = useParams();
  const reportId = params.reportId;

  const [report, setReport] = useState();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msgApi, contextHolder] = message.useMessage();

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
      setSections((prev) => {
        const updatedSections = prev.map((sec) =>
          sec._id === id ? { ...sec, content: newContent } : sec
        );
        return updatedSections;
      });

      await updateReportSection(reportId, id, newContent);
      loadReport();
      msgApi.success("Cập nhật thành công.");
    } catch (error) {
      console.error("Error updating content:", error);
      msgApi.error("Cập nhật thất bại.");
    }
  }, 1000);

  if (loading) {
    return <FullscreenLoader label="Loading" />;
  }

  return (
    <Room>
      {contextHolder}
      <form className="p-6 space-y-6 bg-white rounded-lg shadow">
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
                className="border border-gray-200 rounded p-3 min-h-[150px]"
              >
                <SectionEditor
                  field={sec._id}
                  initialContent={reportSection?.content || ""}
                  onChange={(newHtml) => handleContentChange(sec._id, newHtml)}
                />
              </div>
            </div>
          );
        })}
      </form>
    </Room>
  );
}
