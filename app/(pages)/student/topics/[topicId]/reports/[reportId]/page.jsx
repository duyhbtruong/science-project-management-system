"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import { SectionEditor } from "./section-editor";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { useParams } from "next/navigation";
import { getTopicById, updateTopicById } from "@/service/topicService";
import { useDebounce } from "@/hooks/use-debounce";

export default function ReportPage() {
  const params = useParams();
  const topicId = params.topicId;

  const [topic, setTopic] = useState();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msgApi, contextHolder] = message.useMessage();

  const loadTopic = async () => {
    const res = await getTopicById(topicId);
    setTopic(await res.json());
  };

  useEffect(() => {
    if (!topicId) return;
    loadTopic();
  }, [topicId]);

  useEffect(() => {
    if (!topic) return;
    setSections(topic.sections);
    setLoading(false);
  }, [topic]);

  const handleContentChange = useDebounce((id, newContent) => {
    setSections((prev) => {
      const updatedSections = prev.map((sec) =>
        sec._id === id ? { ...sec, content: newContent } : sec
      );

      updateTopicById(topicId, {
        ...topic,
        sections: updatedSections,
      })
        .then(() => msgApi.success("Cập nhật thành công."))
        .catch(() => msgApi.error("Cập nhật thất bại."));

      console.log("UPDATED: ", updatedSections);

      return updatedSections;
    });
  }, 300);

  if (loading) {
    return <FullscreenLoader label="Loading" />;
  }

  return (
    <>
      {contextHolder}
      <form className="p-6 space-y-6 bg-white rounded-lg shadow">
        {sections.map((sec) => (
          <div key={sec._id} className="space-y-2">
            <label
              htmlFor={`section-${sec._id}`}
              className="block text-base font-medium"
            >
              {sec.title}
            </label>

            <div
              id={`section-${sec.id}`}
              className="border border-gray-200 rounded p-3 min-h-[150px]"
            >
              <SectionEditor
                initialContent={sec.content}
                onChange={(newHtml) => handleContentChange(sec._id, newHtml)}
              />
            </div>
          </div>
        ))}
        {/* you can add a submit button here if you want to post the form */}
      </form>
    </>
  );
}
