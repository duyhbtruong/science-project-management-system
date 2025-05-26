import { NextResponse } from "next/server";
import { SectionTemplate } from "@/models/Section";
import { mongooseConnect } from "@/lib/mongoose";

export async function GET() {
  try {
    await mongooseConnect();
    const sections = await SectionTemplate.find().sort("order");
    return NextResponse.json(sections, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi khi lấy danh sách section " + error },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await mongooseConnect();
    const { title, order } = await request.json();

    const count = await SectionTemplate.countDocuments();
    const section = new SectionTemplate({
      title,
      order: order ?? count,
    });

    const saved = await section.save();
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi khi tạo section " + error },
      { status: 500 }
    );
  }
}
