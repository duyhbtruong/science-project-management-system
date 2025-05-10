import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { Criteria } from "@/models/Criteria";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    await mongooseConnect();
    const criteria = await Criteria.findByIdAndUpdate(id, updates, {
      new: true,
    });
    return NextResponse.json(criteria, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating criteria: " + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await mongooseConnect();
    await Criteria.findByIdAndDelete(id);
    return NextResponse.json({ message: "Criteria deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error deleting criteria: " + error },
      { status: 500 }
    );
  }
}
