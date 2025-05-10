import { NextResponse } from "next/server";
import { mongooseConnect } from "@/lib/mongoose";
import { Criteria } from "@/models/Criteria";

export async function GET() {
  try {
    await mongooseConnect();
    const criteria = await Criteria.find().sort("order");
    return NextResponse.json(criteria, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error loading criteria list: " + error },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { title, minGrade, maxGrade, step } = await request.json();
    await mongooseConnect();
    const criteria = await Criteria.create({ title, minGrade, maxGrade, step });
    return NextResponse.json(criteria, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating criteria: " + error },
      { status: 500 }
    );
  }
}
