import { mongooseConnect } from "@/lib/mongoose";
import { Topic } from "@/models/Topic";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await mongooseConnect();
  const { id: topicId } = params;
  if (!mongoose.isValidObjectId(topicId)) {
    return NextResponse.json(
      { message: "Sai định dạng ObjectId!" },
      { status: 200 }
    );
  }
  const topic = await Topic.findOne({ _id: topicId });
  if (!topic) {
    return NextResponse.json(
      { message: "Đề tài không tồn tại!" },
      { status: 200 }
    );
  } else {
    return NextResponse.json(topic, { status: 200 });
  }
}
