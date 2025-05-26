import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { Report } from "@/models/Report";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sectionId = searchParams.get("sectionId");

    await mongooseConnect();

    if (sectionId) {
      if (!mongoose.isValidObjectId(sectionId)) {
        return NextResponse.json(
          { message: "Section id không hợp lệ" },
          { status: 400 }
        );
      }

      const report = await Report.findOne({
        "sections._id": sectionId,
      }).select("+sections.embedding");

      if (!report) {
        return NextResponse.json(
          { message: "Không tìm thấy báo cáo" },
          { status: 404 }
        );
      }

      const section = report.sections.find(
        (section) => section._id.toString() === sectionId
      );

      console.log("SECTION: ", section);

      const similarReports = await Report.aggregate([
        {
          $vectorSearch: {
            index: "search_report",
            path: "sections.embedding",
            queryVector: section.embedding,
            numCandidates: 100,
            limit: 5,
          },
        },
        {
          $project: {
            _id: 1,
            studentId: 1,
            instructorId: 1,
            topicId: 1,
            submittedDate: 1,
            score: {
              $meta: "vectorSearchScore",
            },
          },
        },
      ]);

      return NextResponse.json(similarReports, { status: 200 });
    }

    const reports = await Report.find();

    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi khi lấy danh sách báo cáo " + error },
      { status: 500 }
    );
  }
}
