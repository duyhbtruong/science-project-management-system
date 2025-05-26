import { mongooseConnect } from "@/lib/mongoose";
import { Report } from "@/models/Report";
import { Section, SectionTemplate } from "@/models/Section";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    const reportId = params.reportId;
    const templateId = params.templateId;

    if (!reportId || !mongoose.isValidObjectId(reportId)) {
      return NextResponse.json(
        { message: "Thiếu report Id hoặc report Id không hợp lệ!" },
        { status: 400 }
      );
    }

    if (!templateId || !mongoose.isValidObjectId(templateId)) {
      return NextResponse.json(
        { message: "Thiếu template Id hoặc template Id không hợp lệ!" },
        { status: 400 }
      );
    }

    await mongooseConnect();
    const { content, embedding } = await request.json();

    const report = await Report.findById(reportId);
    if (!report) {
      return NextResponse.json(
        { message: "Không tìm thấy báo cáo." },
        { status: 404 }
      );
    }

    const template = await SectionTemplate.findById(templateId);
    if (!template) {
      return NextResponse.json(
        { message: "Không tìm thấy template." },
        { status: 404 }
      );
    }

    const section = await Section.findOne({
      reportId: reportId,
      templateId: templateId,
    });

    if (!section) {
      const newSection = await Section.create({
        reportId: reportId,
        templateId: templateId,
        content: content,
        embedding: embedding,
      });

      await Report.updateOne(
        { _id: reportId },
        { $push: { sections: newSection._id } }
      );
    } else {
      section.content = content;
      section.embedding = embedding;
      await section.save();
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
