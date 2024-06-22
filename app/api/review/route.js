import { mongooseConnect } from "@/lib/mongoose";
import { ReviewGrade } from "@/models/ReviewGrade";
import { Topic } from "@/models/Topic";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request) {
  await mongooseConnect();
  const id = request.nextUrl.searchParams.get("id");
  const topicId = request.nextUrl.searchParams.get("topicId");
  const technologyScienceId = request.nextUrl.searchParams.get(
    "technologyScienceId"
  );

  // Get dựa theo Id của bảng Review Grade
  if (id) {
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Không đúng định dạng ObjectId!" },
        { status: 200 }
      );
    }
    const review = await ReviewGrade.findOne({ _id: id });
    return NextResponse.json(review, {
      status: 200,
    });
  }

  // Get dựa theo Id của topicId và technologyScienceId
  if (topicId && technologyScienceId) {
    if (
      !mongoose.isValidObjectId(topicId) ||
      !mongoose.isValidObjectId(technologyScienceId)
    ) {
      return NextResponse.json(
        { message: "Không đúng định dạng ObjectId!" },
        { status: 200 }
      );
    }
    const review = await ReviewGrade.findOne({
      $and: [
        { topicId: topicId },
        { technologyScienceId: technologyScienceId },
      ],
    });
    return NextResponse.json(review, { status: 200 });
  }

  // Get all
  return NextResponse.json(await ReviewGrade.find(), { status: 200 });
}

export async function POST(request) {
  await mongooseConnect();
  const { topicId, technologyScienceId, criteria, grade, isEureka, note } =
    await request.json();

  // Kiểm tra Object Id
  if (
    !mongoose.isValidObjectId(topicId) ||
    !mongoose.isValidObjectId(technologyScienceId)
  ) {
    return NextResponse.json(
      { message: "Sai định dạng Object Id!" },
      { status: 200 }
    );
  }

  // Kiểm tra xem có phải update không
  const isUpdate = await ReviewGrade.find({
    $and: [{ topicId: topicId }, { technologyScienceId: technologyScienceId }],
  });

  if (isUpdate.length === 1) {
    await ReviewGrade.updateOne(
      {
        $and: [
          { topicId: topicId },
          { technologyScienceId: technologyScienceId },
        ],
      },
      {
        $set: {
          criteria: criteria,
          grade: grade,
          isEureka: isEureka,
          note: note,
        },
      }
    );
    return NextResponse.json(
      { message: "Đã cập nhật thành công!" },
      { status: 200 }
    );
  }

  await ReviewGrade.create({
    topicId,
    technologyScienceId,
    criteria,
    grade,
    isEureka,
    note,
  });

  // Kiểm tra lần đánh giá này có phải là đánh giá đầu tiên hay không
  const { isReviewed } = await Topic.findOne(
    { _id: topicId },
    { isReviewed: 1 }
  );
  const { _id: reviewId } = await ReviewGrade.findOne(
    {
      $and: [
        { topicId: topicId },
        { technologyScienceId: technologyScienceId },
      ],
    },
    { _id: 1 }
  );
  // Trường hợp 1 - Chưa tồn tại đánh giá nào
  if (!isReviewed) {
    await Topic.updateOne({ _id: topicId }, { $set: { isReviewed: true } });
    await Topic.updateOne({ _id: topicId }, { $push: { reviews: reviewId } });
    return NextResponse.json(
      { message: "Đã kiểm duyệt lần đầu tiên thành công!" },
      { status: 200 }
    );
  }

  // Trường hợp 2 - Đã tồn tại 1 đánh giá
  if (isReviewed) {
    await Topic.updateOne({ _id: topicId }, { $push: { reviews: reviewId } });
    return NextResponse.json(
      { message: "Đã kiểm duyệt thành công!" },
      { status: 200 }
    );
  }

  return NextResponse.json({ message: "Có gì đó sai sai..." }, { status: 200 });
}

export async function DELETE(request) {
  await mongooseConnect();
  const topicId = request.nextUrl.searchParams.get("topicId");
  const technologyScienceId = request.nextUrl.searchParams.get(
    "technologyScienceId"
  );

  if (
    !mongoose.isValidObjectId(topicId) ||
    !mongoose.isValidObjectId(technologyScienceId)
  ) {
    return NextResponse.json(
      { message: "Sai định dạng Object Id!" },
      { status: 200 }
    );
  }

  const { _id: reviewId } = await ReviewGrade.findOne(
    {
      $and: [
        { topicId: topicId },
        { technologyScienceId: technologyScienceId },
      ],
    },
    { _id: 1 }
  );

  await ReviewGrade.findByIdAndDelete(reviewId);
  await Topic.updateOne({ _id: topicId }, { $pull: { reviews: reviewId } });
  console.log(topicId);
  const topic = await Topic.findOne({ _id: topicId });
  console.log(topic);
  console.log(reviewId);
  if (topic.reviews.length === 0) {
    await Topic.updateOne({ _id: topicId }, { $set: { isReviewed: false } });
  }

  return NextResponse.json({ message: "Đã xóa thành công!" }, { status: 200 });
}
