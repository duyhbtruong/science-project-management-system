import { stripHtml } from "@/utils/format";

export const getReportById = async (reportId) => {
  try {
    const res = await fetch(`/api/reports/${reportId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to get report by id");
    }

    return res;
  } catch (error) {
    return error;
  }
};

export const updateReportSection = async (reportId, sectionId, content) => {
  try {
    const cleanContent = stripHtml(content);
    const embeddingResponse = await fetch(
      `http://localhost:3000/api/openai/embed`,
      {
        method: "POST",
        body: JSON.stringify({ text: cleanContent }),
      }
    );

    const { embedding } = await embeddingResponse.json();
    const response = await fetch(
      `http://localhost:3000/api/reports/${reportId}/sections/${sectionId}`,
      {
        method: "PUT",
        body: JSON.stringify({ cleanContent, embedding }),
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};
