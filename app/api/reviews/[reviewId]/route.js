import { mongooseConnect } from "@/lib/mongoose";
import { ReviewGrade } from "@/models/ReviewGrade";
import { Topic } from "@/models/Topic";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { isWithinReviewPeriod } from "@/utils/validator";

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
        "vietnameseName englishName summary expectedResult participants reference instructor owner registrationPeriod",
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
        {
          path: "registrationPeriod",
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

    const review = await ReviewGrade.findOne({ _id: reviewId }).populate({
      path: "topicId",
      populate: {
        path: "registrationPeriod",
        select: "endDate reviewDeadline",
      },
    });

    if (!review) {
      return NextResponse.json(
        { message: "Không tìm thấy đánh giá." },
        { status: 404 }
      );
    }

    // Check if we're in the review period
    if (!isWithinReviewPeriod(review.topicId.registrationPeriod)) {
      return NextResponse.json(
        {
          message:
            "Không trong thời gian kiểm duyệt. Chỉ có thể kiểm duyệt đề tài trong khoảng thời gian từ ngày kết thúc đăng ký đến hạn kiểm duyệt.",
        },
        { status: 403 }
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

    const review = await ReviewGrade.findOne({ _id: reviewId }).populate({
      path: "topicId",
      populate: {
        path: "registrationPeriod",
        select: "endDate reviewDeadline",
      },
    });

    if (!review) {
      return NextResponse.json(
        { message: "Không tìm thấy đánh giá." },
        { status: 404 }
      );
    }

    // Check if we're in the review period
    if (!isWithinReviewPeriod(review.topicId.registrationPeriod)) {
      return NextResponse.json(
        {
          message:
            "Không trong thời gian kiểm duyệt. Chỉ có thể hủy kiểm duyệt đề tài trong khoảng thời gian từ ngày kết thúc đăng ký đến hạn kiểm duyệt.",
        },
        { status: 403 }
      );
    }

    const topicId = review.topicId;
    const instructorId = review.instructorId;

    await ReviewGrade.findByIdAndDelete(reviewId);

    if (review.status !== "cancelled") {
      const newReviewGrade = new ReviewGrade({
        topicId,
        instructorId,
        status: "pending",
      });

      await Topic.findByIdAndUpdate(
        topicId,
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

      await newReviewGrade.save();
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
