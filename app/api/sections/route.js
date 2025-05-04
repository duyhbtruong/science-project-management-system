import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { Section } from "@/models/Section";

export async function GET() {
  try {
    await mongooseConnect();
    const sections = await Section.find().sort("order");
    return NextResponse.json(sections, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi lấy danh sách tiêu chí " + error },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title, order } = await request.json();
    if (!title?.trim()) {
      return NextResponse.json({ message: "Thiếu tiêu đề" }, { status: 400 });
    }

    await mongooseConnect();
    const count = await Section.countDocuments();
    const section = new Section({
      title: title.trim(),
      order: typeof order === "number" ? order : count,
    });
    const saved = await section.save();
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi lấy tạo tiêu chí " + error },
      { status: 500 }
    );
  }
}
