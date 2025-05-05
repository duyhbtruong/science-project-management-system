import { mongooseConnect } from "@/lib/mongoose";
import { Topic } from "@/models/Topic";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const topicId = params.topicId;
    const { registerFile, contractFile, submitFile, paymentFile } =
      await request.json();
    if (!topicId || !mongoose.isValidObjectId(topicId)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        { status: 400 }
      );
    }

    await mongooseConnect();

    const topic = await Topic.findOne({ _id: topicId });

    if (!topic) {
      return NextResponse.json(
        { message: "Không tìm thấy đề tài." },
        { status: 404 }
      );
    }

    if (registerFile) {
      await Topic.updateOne(
        { _id: topicId },
        { $set: { registerFile: registerFile } }
      );
    }

    if (submitFile) {
      await Topic.updateOne(
        { _id: topicId },
        { $set: { submitFile: submitFile } }
      );
    }

    if (contractFile) {
      await Topic.updateOne(
        { _id: topicId },
        { $set: { contractFile: contractFile } }
      );
    }

    if (paymentFile) {
      await Topic.updateOne(
        { _id: topicId },
        { $set: { paymentFile: paymentFile } }
      );
    }

    return NextResponse.json({ message: "Upload tài liệu thành công!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi tải tài liệu " + error },
      { status: 500 }
    );
  }
}
