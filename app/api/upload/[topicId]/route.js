import { mongooseConnect } from "@/lib/mongoose";
import { Topic } from "@/models/Topic";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { TopicFile } from "@/models/TopicFile";

export async function PUT(request, { params }) {
  try {
    const topicId = params.topicId;
    const { registerFile, contractFile, submitFile, paymentFile } =
      await request.json();

    const session = await auth();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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

    const fileUpdates = [
      { type: "register", file: registerFile },
      { type: "contract", file: contractFile },
      { type: "submit", file: submitFile },
      { type: "payment", file: paymentFile },
    ];

    for (const { type, file } of fileUpdates) {
      if (file) {
        const existingFile = await TopicFile.findOne({
          topicId,
          fileType: type,
        });

        if (existingFile) {
          await TopicFile.findByIdAndUpdate(existingFile._id, {
            fileName: file.name,
            fileUrl: file.url,
            uploadedBy: session.user.id,
          });
        } else {
          await TopicFile.create({
            topicId,
            fileType: type,
            fileName: file.name,
            fileUrl: file.url,
            uploadedBy: session.user.id,
          });
        }
      }
    }

    return NextResponse.json({ message: "Upload tài liệu thành công!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi tải tài liệu " + error },
      { status: 500 }
    );
  }
}
