import { stripHtml } from "@/utils/format";

export const semanticSearchReports = async (templateId, reportId) => {
  try {
    const res = await fetch(
      `/api/reports?templateId=${templateId}&reportId=${reportId}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to get reports");
    }

    return res;
  } catch (error) {
    return error;
  }
};

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

export const updateReportSection = async (reportId, templateId, content) => {
  try {
    const cleanContent = stripHtml(content);
    if (cleanContent) {
      const embeddingResponse = await fetch(`/api/openai/embed`, {
        method: "POST",
        body: JSON.stringify({ text: cleanContent }),
      });

      const { embedding } = await embeddingResponse.json();
      const response = await fetch(
        `/api/reports/${reportId}/sections/${templateId}`,
        {
          method: "PUT",
          body: JSON.stringify({ content, embedding }),
        }
      );

      return response;
    } else {
      const embedding = [];
      const response = await fetch(
        `/api/reports/${reportId}/sections/${templateId}`,
        {
          method: "PUT",
          body: JSON.stringify({ content, embedding }),
        }
      );

      return response;
    }
  } catch (error) {
    return error;
  }
};
