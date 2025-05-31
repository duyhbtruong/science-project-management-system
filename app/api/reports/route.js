import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { Report } from "@/models/Report";
import mongoose from "mongoose";
import { Section } from "@/models/Section";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const templateId = searchParams.get("templateId");
    const reportId = searchParams.get("reportId");

    await mongooseConnect();

    if (templateId && reportId) {
      if (!mongoose.isValidObjectId(templateId)) {
        return NextResponse.json(
          { message: "Template id không hợp lệ" },
          { status: 400 }
        );
      }

      if (!mongoose.isValidObjectId(reportId)) {
        return NextResponse.json(
          { message: "Report id không hợp lệ" },
          { status: 400 }
        );
      }

      const section = await Section.findOne({
        reportId: reportId,
        templateId: templateId,
      });

      if (!section) {
        return NextResponse.json(
          { message: "Không tìm thấy section" },
          { status: 404 }
        );
      }

      const similarReports = await Section.aggregate([
        {
          $vectorSearch: {
            filter: {
              reportId: {
                $ne: mongoose.Types.ObjectId.createFromHexString(reportId),
              },
            },
            index: "section_vector_search",
            path: "embedding",
            queryVector: section.embedding,
            numCandidates: 500,
            limit: 10,
          },
        },
        {
          $lookup: {
            from: "reports",
            localField: "reportId",
            foreignField: "_id",
            as: "report",
          },
        },
        {
          $unwind: "$report",
        },
        {
          $project: {
            _id: 1,
            templateId: 1,
            content: 1,
            report: 1,
            score: {
              $meta: "vectorSearchScore",
            },
          },
        },
        {
          $match: {
            // score: { $gte: 0.75 },
          },
        },
        {
          $sort: { score: -1 },
        },
        {
          $limit: 5,
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
