import { NextResponse } from "next/server";
import { SectionTemplate } from "@/models/Section";
import { mongooseConnect } from "@/lib/mongoose";

export async function PUT(request) {
  try {
    await mongooseConnect();
    const { sections } = await request.json();

    if (!Array.isArray(sections)) {
      return NextResponse.json(
        { message: "Invalid sections data" },
        { status: 400 }
      );
    }

    const ops = sections.map((section) => ({
      updateOne: {
        filter: { _id: section.id },
        update: { $set: { order: section.order } },
      },
    }));

    await SectionTemplate.bulkWrite(ops);

    const updatedSections = await SectionTemplate.find().sort("order");
    return NextResponse.json(updatedSections);
  } catch (error) {
    return NextResponse.json(
      { message: "Error reordering sections: " + error.message },
      { status: 500 }
    );
  }
}
