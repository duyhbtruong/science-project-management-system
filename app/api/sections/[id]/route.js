import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { Section } from "@/models/Section";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    const patch = {};
    if (typeof updates.title === "string") patch.title = updates.title.trim();
    if (typeof updates.order === "number") patch.order = updates.order;

    await mongooseConnect();
    const updated = await Section.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return NextResponse.json(
        { message: "Không tìm thấy tiêu chí." },
        { status: 404 }
      );
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi cập nhật tiêu chí " + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await mongooseConnect();
    const deleted = await Section.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { message: "Không tìm thấy tiêu chí." },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Xóa tiêu chí thành công.", id });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi xóa tiêu chí " + error },
      { status: 500 }
    );
  }
}
