import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  const { text } = await request.json();
  if (!text) {
    return NextResponse.json({ message: "Thiếu nội dung" }, { status: 400 });
  }

  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return NextResponse.json(
    { embedding: embedding.data[0].embedding },
    { status: 200 }
  );
}
