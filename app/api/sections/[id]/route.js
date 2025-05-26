import { NextResponse } from "next/server";
import { SectionTemplate, Section } from "@/models/Section";
import { Report } from "@/models/Report";
import { mongooseConnect } from "@/lib/mongoose";
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid section ID" },
        { status: 400 }
      );
    }

    await mongooseConnect();
    const patch = await request.json();
    const updated = await SectionTemplate.findByIdAndUpdate(id, patch, {
      new: true,
    });

    if (!updated) {
      return NextResponse.json(
        { message: "Section not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating section: " + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Invalid section ID" },
        { status: 400 }
      );
    }

    await mongooseConnect();
    const deleted = await SectionTemplate.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Section not found" },
        { status: 404 }
      );
    }

    const sections = await Section.find({ templateId: id });

    for (const section of sections) {
      await Report.updateOne(
        { _id: section.reportId },
        { $pull: { sections: section._id } }
      );
    }

    await Section.deleteMany({ templateId: id });

    return NextResponse.json({ message: "Section deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting section: " + error.message },
      { status: 500 }
    );
  }
}
