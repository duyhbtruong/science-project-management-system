import { mongooseConnect } from "@/lib/mongoose";
import { ReviewGrade } from "@/models/ReviewGrade";
import { Student } from "@/models/Student";
import { Topic } from "@/models/Topic";
import { NextResponse } from "next/server";

export async function GET(request) {
  await mongooseConnect();

  // Trường hợp tìm kiếm đề tài
  const search = request.nextUrl.searchParams.get("search");
  if (search) {
    const topics = await Topic.find({
      $or: [
        { vietnameseName: { $regex: ".*" + search + ".*" } },
        { englishName: { $regex: ".*" + search + ".*" } },
      ],
    });
    return NextResponse.json(topics, { status: 200 });
  }
  // Trường hợp get all đề tài
  const topics = await Topic.find();
  return NextResponse.json(topics, { status: 200 });
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

export async function DELETE(request) {
  await mongooseConnect();
  const id = request.nextUrl.searchParams.get("id");

  await Topic.findByIdAndDelete(id);
  const studentId = await Student.findOne({ topicId: id }, { _id: 1 });
  await Student.findByIdAndUpdate(studentId, { topicId: null });
  await ReviewGrade.deleteMany({ topicId: id });
  await AppraiseGrade.deleteMany({ topicId: id });
  return NextResponse.json(
    { message: "Hủy đăng ký đề tài thành công!" },
    { status: 200 }
  );
}
