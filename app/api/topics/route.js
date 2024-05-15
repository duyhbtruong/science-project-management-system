import { mongooseConnect } from "@/lib/mongoose";
import { Topic } from "@/models/Topic";
import { NextResponse } from "next/server";

export async function GET(request) {
  await mongooseConnect();
  return NextResponse.json(await Topic.find());
}

export async function POST(request) {
  await mongooseConnect();
  const {
    vietnameseName,
    englishName,
    type,
    summary,
    reference,
    expectedResult,
    participants,
    academicRank,
    owner,
    instructor,
  } = await request.json();

  await Topic.create({
    vietnameseName,
    englishName,
    type,
    summary,
    reference,
    expectedResult,
    participants,
    academicRank,
    owner,
    instructor,
  });
  return NextResponse.json({ message: "Topic created!" }, { status: 201 });
}
