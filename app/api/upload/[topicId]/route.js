import { auth } from "@/auth";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";

import { storage } from "@/lib/firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

import { Topic } from "@/models/Topic";
import { TopicFile } from "@/models/TopicFile";

export async function PUT(request, { params }) {
  try {
    const topicId = params.topicId;
    const formData = await request.formData();
    const file = formData.get("file");
    const fileType = formData.get("fileType");
    const fileName = formData.get("fileName");
    const periodDir = formData.get("periodDir");
    const studentId = formData.get("studentId");

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

    if (!file || !fileType || !fileName || !periodDir || !studentId) {
      return NextResponse.json(
        { message: "Thiếu thông tin file." },
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

    const fileRef = ref(storage, `${periodDir}/${studentId}/${fileName}`);
    const fileBuffer = await file.arrayBuffer();
    const snapshot = await uploadBytes(fileRef, fileBuffer, {
      contentType: "application/pdf",
    });
    const downloadLink = await getDownloadURL(snapshot.ref);

    const existingFile = await TopicFile.findOne({
      topicId,
      fileType,
    });

    if (existingFile) {
      await TopicFile.findByIdAndUpdate(existingFile._id, {
        fileName,
        fileUrl: downloadLink,
        uploadedBy: session.user.id,
      });
    } else {
      await TopicFile.create({
        topicId,
        fileType,
        fileName,
        fileUrl: downloadLink,
        uploadedBy: session.user.id,
      });
    }

    return NextResponse.json(
      {
        message: "Upload tài liệu thành công!",
        fileUrl: downloadLink,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi tải tài liệu " + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const topicId = params.topicId;
    const { fileType } = await request.json();

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

    if (!fileType) {
      return NextResponse.json(
        { message: "Thiếu loại file cần xóa." },
        { status: 400 }
      );
    }

    await mongooseConnect();

    const fileRecord = await TopicFile.findOne({
      topicId,
      fileType,
    });

    if (!fileRecord) {
      return NextResponse.json(
        { message: "Không tìm thấy file cần xóa." },
        { status: 404 }
      );
    }

    const fileRef = ref(storage, fileRecord.fileUrl);
    await deleteObject(fileRef);

    await TopicFile.findByIdAndDelete(fileRecord._id);

    return NextResponse.json(
      { message: "Xóa file thành công!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi xóa file " + error },
      { status: 500 }
    );
  }
}
