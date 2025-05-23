import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { prompt, action, currentContent } = await req.json();

  let fullPrompt = prompt;

  if (action === "lengthen") {
    fullPrompt = `Make the following content longer and more detailed:\n\n${currentContent}`;
  } else if (action === "shorten") {
    fullPrompt = `Make the following content more concise:\n\n${currentContent}`;
  } else if (action === "improve") {
    fullPrompt = `Improve the following content:\n\n${currentContent}`;
  } else if (action === "fixGrammar") {
    fullPrompt = `Fix the grammar of the following content:\n\n${currentContent}`;
  }

  if (!fullPrompt) return new Response("Prompt is required.", { status: 400 });

  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: fullPrompt,
    instructions:
      "Format the response in HTML with headings, paragraphs, and styled tags where appropriate. The response does not need to have <html> and <head> tag.",
  });

  if (!response) return new Response("Cannot call to OpenAI.", { status: 401 });

  return new Response(JSON.stringify(response), { status: 200 });
}
