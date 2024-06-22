import { mongooseConnect } from "@/lib/mongoose";
import { Topic } from "@/models/Topic";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(request) {
  await mongooseConnect();
  const topicId = request.nextUrl.searchParams.get("topicId");

  if (!mongoose.isValidObjectId(topicId)) {
    return NextResponse.json(
      { message: "Sai định dạng ObjectId!" },
      { status: 200 }
    );
  }

  const fileRef = await request.json();
  await Topic.updateOne({ _id: topicId }, { $set: { fileRef: fileRef } });
  return NextResponse.json({ message: "Upload tài liệu thành công!" });
}
