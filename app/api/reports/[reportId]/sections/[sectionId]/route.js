import { mongooseConnect } from "@/lib/mongoose";
import { Report } from "@/models/Report";
import { Section } from "@/models/Section";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const reportId = params.reportId;
    const sectionId = params.sectionId;

    if (!reportId || !mongoose.isValidObjectId(reportId)) {
      return NextResponse.json(
        { message: "Thiếu report Id hoặc report Id không hợp lệ!" },
        { status: 400 }
      );
    }

    if (!sectionId || !mongoose.isValidObjectId(sectionId)) {
      return NextResponse.json(
        { message: "Thiếu section Id hoặc section Id không hợp lệ!" },
        { status: 400 }
      );
    }

    await mongooseConnect();
    const { content, embedding } = await request.json();

    const report = await Report.findOne({ _id: reportId }).populate("sections");
    if (!report) {
      return NextResponse.json(
        { message: "Không tìm thấy báo cáo." },
        { status: 404 }
      );
    }

    const section = await Section.findOne({ _id: sectionId });
    if (!section) {
      return NextResponse.json(
        { message: "Không tìm thấy section." },
        { status: 404 }
      );
    }

    const existingSection = report.sections.some(
      (section) => section._id.toString() === sectionId
    );

    if (!existingSection) {
      await Report.updateOne(
        { _id: reportId },
        {
          $push: {
            sections: {
              _id: sectionId,
              title: section.title,
              order: section.order,
              content: content,
              embedding: embedding,
            },
          },
        }
      );
    } else {
      await Report.updateOne(
        { _id: reportId },
        {
          $set: {
            "sections.$[elem].content": content,
            "sections.$[elem].embedding": embedding,
          },
        },
        {
          arrayFilters: [{ "elem._id": sectionId }],
        }
      );
    }

    return NextResponse.json(
      { message: "Cập nhật báo cáo thành công." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi cập nhật section " + error },
      { status: 500 }
    );
  }
}
