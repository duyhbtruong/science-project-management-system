import { mongooseConnect } from "@/lib/mongoose";
import { Topic } from "@/models/Topic";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  try {
    const { topicId, sectionId } = params;
    const { content, embedding } = await request.json();

    if (!topicId || !mongoose.isValidObjectId(topicId) || !sectionId) {
      return NextResponse.json(
        { message: "Invalid topic ID or section ID" },
        { status: 400 }
      );
    }

    await mongooseConnect();

    const topic = await Topic.findById(topicId).select("+sections");

    if (!topic) {
      return NextResponse.json({ message: "Topic not found" }, { status: 404 });
    }

    if (!topic.sections || !Array.isArray(topic.sections)) {
      return NextResponse.json(
        { message: "Sections not found in topic" },
        { status: 404 }
      );
    }

    let sectionFound = false;
    for (let i = 0; i < topic.sections.length; i++) {
      if (topic.sections[i]._id.toString() === sectionId) {
        topic.sections[i].content = content;

        if (embedding) {
          topic.sections[i].embedding = embedding;
        }

        sectionFound = true;
        break;
      }
    }

    if (!sectionFound) {
      return NextResponse.json(
        { message: "Section not found" },
        { status: 404 }
      );
    }

    await topic.save();

    return NextResponse.json(
      { message: "Section updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      { message: "Error updating section: " + error.message },
      { status: 500 }
    );
  }
}
