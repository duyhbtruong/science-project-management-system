import { mongooseConnect } from "@/lib/mongoose";
import { ReviewGrade } from "@/models/ReviewGrade";
import { Topic } from "@/models/Topic";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const reviewId = params.review;

    if (!reviewId || !mongoose.isValidObjectId(reviewId)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    await mongooseConnect();

    const review = await ReviewGrade.findOne({ _id: reviewId });

    if (!review) {
      return new NextResponse("Không tìm thấy đánh giá.", { status: 404 });
    }

    return NextResponse.json(review, { status: 200 });
  } catch (error) {
    return new NextResponse("Lỗi lấy thông tin đánh giá " + error, {
      status: 500,
    });
  }
}

export async function PUT(request, { params }) {
  try {
    const reviewId = params.review;
    const { criteria, grade, isEureka, note } = await request.json();

    if (!reviewId || !mongoose.isValidObjectId(reviewId)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    await mongooseConnect();

    const review = await ReviewGrade.findOne({ _id: reviewId });

    if (!review) {
      return new NextResponse("Không tìm thấy đánh giá.", { status: 404 });
    }

    await ReviewGrade.findByIdAndUpdate(reviewId, {
      criteria,
      grade,
      isEureka,
      note,
    });

    return NextResponse.json(
      { message: "Cập nhật đánh giá thành công." },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Lỗi cập nhật thông tin đánh giá " + error, {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const reviewId = params.review;

    if (!reviewId || !mongoose.isValidObjectId(reviewId)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    await mongooseConnect();

    const review = await ReviewGrade.findOne({ _id: reviewId });

    if (!review) {
      return new NextResponse("Không tìm thấy đánh giá.", { status: 404 });
    }

    const topic = await Topic.findOne({
      "reviews.0": mongoose.Types.ObjectId.createFromHexString(reviewId),
    });

    if (!topic) {
      return new NextResponse("Không tìm thấy đề tài", { status: 404 });
    }

    await Topic.findByIdAndUpdate({ _id: topic._id }, { reviews: [] });

    await ReviewGrade.findByIdAndDelete(reviewId);

    return NextResponse.json(
      { message: "Xóa đánh giá thành công." },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Lỗi xóa đánh giá " + error, { status: 500 });
  }
}
