import { mongooseConnect } from "@/lib/mongoose";
import { ReviewGrade } from "@/models/ReviewGrade";
import { Account } from "@/models/users/Account";
import { Topic } from "@/models/Topic";
import { Instructor } from "@/models/users/Instructor";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const topicId = request.nextUrl.searchParams.get("topicId");

    if (!topicId || !mongoose.isValidObjectId(topicId)) {
      return NextResponse.json(
        { message: "Thiếu topic id hoặc topic id không hợp lệ." },
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

    // TODO: Replace findOne() with find()
    const reviews = await ReviewGrade.findOne({ topicId: topicId })
      .populate({
        path: "topicId",
        select:
          "vietnameseName englishName type summary reference participants expectedResult",
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
    const { topicId, instructorId, criteria, grade, isEureka, note } =
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

    if (!instructor._id.equals(topic.reviewInstructor)) {
      return NextResponse.json(
        { message: "Giảng viên không phải người kiểm duyệt đề tài." },
        {
          status: 409,
        }
      );
    }

    if (topic.reviews.length > 0) {
      return NextResponse.json(
        { message: "Đề tài đã được đánh giá" },
        {
          status: 409,
        }
      );
    }

    const createdReview = await ReviewGrade.create({
      topicId,
      instructorId,
      criteria,
      grade,
      isEureka,
      note,
    });

    await Topic.findByIdAndUpdate(
      { _id: topicId },
      {
        reviews: [...topic.reviews, createdReview._id],
      }
    );

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
