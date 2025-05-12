import { mongooseConnect } from "@/lib/mongoose";
import { ReviewGrade } from "@/models/ReviewGrade";
import { Topic } from "@/models/Topic";
import { Account } from "@/models/users/Account";
import { Instructor } from "@/models/users/Instructor";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const reviewId = params.reviewId;

    if (!reviewId || !mongoose.isValidObjectId(reviewId)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const review = await ReviewGrade.findOne({ _id: reviewId }).populate({
      path: "topicId",
      select:
        "vietnameseName englishName summary expectedResult participants reference instructor",
      populate: {
        path: "instructor",
        populate: {
          path: "accountId",
          select: "name email phone role",
        },
      },
    });

    if (!review) {
      return NextResponse.json(
        { message: "Không tìm thấy đánh giá." },
        { status: 404 }
      );
    }

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi lấy thông tin đánh giá " + error },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const reviewId = params.reviewId;
    const { criteria, finalGrade, isEureka, comment } = await request.json();

    if (!reviewId || !mongoose.isValidObjectId(reviewId)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const review = await ReviewGrade.findOne({ _id: reviewId });

    if (!review) {
      return NextResponse.json(
        { message: "Không tìm thấy đánh giá." },
        { status: 404 }
      );
    }

    await ReviewGrade.findByIdAndUpdate(reviewId, {
      criteria,
      finalGrade,
      isEureka,
      comment,
    });

    return NextResponse.json(
      { message: "Cập nhật đánh giá thành công." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi cập nhật thông tin đánh giá " + error },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const reviewId = params.reviewId;

    if (!reviewId || !mongoose.isValidObjectId(reviewId)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const review = await ReviewGrade.findOne({ _id: reviewId });

    if (!review) {
      return NextResponse.json(
        { message: "Không tìm thấy đánh giá." },
        { status: 404 }
      );
    }

    const topic = await Topic.findOne({
      "reviews.0": mongoose.Types.ObjectId.createFromHexString(reviewId),
    });

    if (!topic) {
      return NextResponse.json(
        { message: "Không tìm thấy đề tài" },
        { status: 404 }
      );
    }

    await Topic.findByIdAndUpdate({ _id: topic._id }, { reviews: [] });

    await ReviewGrade.findByIdAndDelete(reviewId);

    return NextResponse.json(
      { message: "Xóa đánh giá thành công." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi xóa đánh giá " + error },
      { status: 500 }
    );
  }
}
