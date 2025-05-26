import { mongooseConnect } from "@/lib/mongoose";
import { ReviewGrade } from "@/models/ReviewGrade";
import { Topic } from "@/models/Topic";
import { Instructor } from "@/models/users/Instructor";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const periodId = searchParams.get("periodId");
    const instructorId = searchParams.get("instructorId");
    const filter = {};

    await mongooseConnect();

    let topicIds = [];
    if (periodId) {
      const topics = await Topic.find({ registrationPeriodId: periodId });
      topicIds = topics.map((topic) => topic._id);
    }

    if (instructorId) {
      filter.instructorId = instructorId;
    }
    if (topicIds.length > 0) {
      filter.topicId = { $in: topicIds };
    }

    const reviews = await ReviewGrade.find(filter)
      .populate({
        path: "topicId",
        select:
          "vietnameseName englishName registrationPeriodId owner createdAt updatedAt",
      })
      .populate({
        path: "instructorId",
        populate: {
          path: "accountId",
          select: "name email phone role",
        },
      });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi lấy danh sách đánh giá " + error },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const { topicId, instructorId, criteria, finalGrade, isEureka, comment } =
      await request.json();

    if (
      !topicId ||
      !mongoose.isValidObjectId(topicId) ||
      !instructorId ||
      !mongoose.isValidObjectId(instructorId)
    ) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const topic = await Topic.findOne({ _id: topicId });

    if (!topic) {
      return NextResponse.json(
        { message: "Không tìm thấy đề tài." },
        { status: 404 }
      );
    }

    const instructor = await Instructor.findOne({ _id: instructorId });

    if (!instructor) {
      return NextResponse.json(
        { message: "Không tìm thấy giảng viên." },
        { status: 404 }
      );
    }

    const newReviewGrade = new ReviewGrade({
      topicId,
      instructorId,
      criteria,
      finalGrade,
      isEureka,
      comment,
      submittedDate: new Date(),
    });

    await newReviewGrade.save();

    return NextResponse.json(
      { message: "Tạo đánh giá thành công!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi tạo đánh giá đề tài " + error },
      {
        status: 500,
      }
    );
  }
}
