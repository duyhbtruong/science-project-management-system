import { mongooseConnect } from "@/lib/mongoose";
import { Student } from "@/models/Student";
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
    owner,
    instructor,
  });
  const topicId = await Topic.findOne({ owner: owner }, { _id: 1 });
  await Student.findByIdAndUpdate({ _id: owner }, { topicId: topicId._id });
  return NextResponse.json(
    { message: "Đăng ký đề tài thành công!" },
    { status: 201 }
  );
}
