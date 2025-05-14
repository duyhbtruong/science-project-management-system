import { mongooseConnect } from "@/lib/mongoose";
import { ReviewGrade } from "@/models/ReviewGrade";
import { Topic } from "@/models/Topic";
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
        "vietnameseName englishName summary expectedResult participants reference instructor owner",
      populate: [
        {
          path: "instructor",
          populate: {
            path: "accountId",
            select: "name email phone role",
          },
        },
        {
          path: "owner",
          populate: {
            path: "accountId",
            select: "name email phone role",
          },
        },
      ],
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

    review.criteria = criteria;
    review.finalGrade = finalGrade;
    review.isEureka = isEureka;
    review.comment = comment;
    review.submittedDate = new Date();
    review.status = "completed";
    await review.save();

    await Topic.updateOne(
      { "reviewAssignments.reviewGrade": reviewId },
      {
        $set: {
          "reviewAssignments.$[elem].status": "completed",
        },
      },
      {
        arrayFilters: [{ "elem.reviewGrade": reviewId }],
      }
    );

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

    await ReviewGrade.findByIdAndDelete(reviewId);

    if (review.status !== "cancelled") {
      const newReviewGrade = await ReviewGrade.create({
        topicId: review.topicId,
        instructorId: review.instructorId,
        status: "pending",
      });

      await Topic.findByIdAndUpdate(
        review.topicId,
        {
          $set: {
            "reviewAssignments.$[elem].reviewGrade": newReviewGrade._id,
            "reviewAssignments.$[elem].status": "pending",
          },
        },
        {
          arrayFilters: [{ "elem.reviewGrade": reviewId }],
        }
      );
    }

    return NextResponse.json(
      { message: "Xóa đánh giá thành công và tạo đánh giá mới." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi xóa đánh giá " + error },
      { status: 500 }
    );
  }
}
