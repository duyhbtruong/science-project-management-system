import { auth } from "@/auth";
import { mongooseConnect } from "@/lib/mongoose";
import { TopicFile } from "@/models/TopicFile";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const searchKeywords = searchParams.get("search");

    const filter = {};
    if (searchKeywords) {
      filter.fileName = { $regex: searchKeywords, $options: "i" };
    }

    await mongooseConnect();
    const files = await TopicFile.find(filter)
      .populate("topicId")
      .populate("uploadedBy")
      .sort({ createdAt: -1 });

    return NextResponse.json(files, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi tải tài liệu " + error },
      { status: 500 }
    );
  }
}
