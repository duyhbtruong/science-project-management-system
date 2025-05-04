import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { Section } from "@/models/Section";

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { message: "Expected an array of { id, order }" },
        { status: 400 }
      );
    }

    await mongooseConnect();
    const ops = body.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order } },
      },
    }));
    await Section.bulkWrite(ops);

    const sections = await Section.find().sort("order");
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi sắp xếp tiêu chí " + error },
      { status: 500 }
    );
  }
}
