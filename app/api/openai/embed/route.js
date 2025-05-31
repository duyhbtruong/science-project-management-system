import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function preprocessText(text) {
  text = text.replace(/<[^>]*>/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  text = text.replace(/[^\w\s.,!?-]/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

export async function POST(request) {
  const { text } = await request.json();
  if (!text) {
    return NextResponse.json({ message: "Thiếu nội dung" }, { status: 400 });
  }

  const processedText = preprocessText(text);

  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: processedText,
  });

  return NextResponse.json(
    { embedding: embedding.data[0].embedding },
    { status: 200 }
  );
}
