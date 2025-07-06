import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { prompt, action, currentContent } = await req.json();

  let fullPrompt = prompt;

  if (action === "lengthen") {
    fullPrompt = `Làm cho nội dung sau dài hơn và chi tiết hơn:\n\n${currentContent}`;
  } else if (action === "shorten") {
    fullPrompt = `Làm cho nội dung sau ngắn gọn hơn:\n\n${currentContent}`;
  } else if (action === "improve") {
    fullPrompt = `Cải thiện nội dung sau:\n\n${currentContent}`;
  } else if (action === "fixGrammar") {
    fullPrompt = `Sửa lỗi ngữ pháp trong nội dung sau:\n\n${currentContent}`;
  }

  if (!fullPrompt) return new Response("Yêu cầu nhập prompt.", { status: 400 });

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: fullPrompt,
    instructions:
      "Định dạng phản hồi bằng HTML với các thẻ tiêu đề, đoạn văn. Phản hồi không cần có thẻ <html> và <head>.",
  });

  if (!response)
    return new Response("Không thể kết nối đến OpenAI.", { status: 401 });

  return new Response(JSON.stringify(response), { status: 200 });
}
