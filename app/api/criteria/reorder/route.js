import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { Criteria } from "@/models/Criteria";

export async function PUT(request) {
  try {
    const criteria = await request.json();
    await mongooseConnect();

    const updatePromises = criteria.map((c, index) =>
      Criteria.findByIdAndUpdate(c.id, { order: index })
    );

    await Promise.all(updatePromises);
    const updatedCriteria = await Criteria.find().sort("order");

    return NextResponse.json(updatedCriteria, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error reordering criteria: " + error },
      { status: 500 }
    );
  }
}
