import { mongooseConnect } from "@/lib/mongoose";
import { Report } from "@/models/Report";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    const reportId = params.reportId;

    if (!reportId || !mongoose.isValidObjectId(reportId)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ" },
        { status: 400 }
      );
    }

    await mongooseConnect();

    const report = await Report.findById(reportId).populate([
      {
        path: "topicId",
      },
      {
        path: "studentId",
        populate: {
          path: "accountId",
        },
      },
      {
        path: "instructorId",
        populate: {
          path: "accountId",
        },
      },
      {
        path: "sections",
        populate: {
          path: "templateId",
        },
      },
    ]);

    if (!report) {
      return NextResponse.json(
        { message: "Không tìm thấy báo cáo" },
        { status: 404 }
      );
    }

    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi khi lấy báo cáo " + error },
      { status: 500 }
    );
  }
}
