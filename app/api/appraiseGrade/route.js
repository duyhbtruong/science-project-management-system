import { mongooseConnect } from "@/lib/mongoose";
import { AppraiseGrade } from "@/models/AppraiseGrade";
import { Topic } from "@/models/Topic";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request) {
  await mongooseConnect();
  const id = request.nextUrl.searchParams.get("id");
  const topicId = request.nextUrl.searchParams.get("topicId");
  const appraisalBoardId = request.nextUrl.searchParams.get("appraisalBoardId");

  // Get dựa theo Id của bảng Review Grade
  if (id) {
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Không đúng định dạng ObjectId!" },
        { status: 200 }
      );
    }
    const appraise = await AppraiseGrade.findOne({ _id: id });
    return NextResponse.json(appraise, {
      status: 200,
    });
  }

  // Get dựa theo Id của topicId và technologyScienceId
  if (topicId && appraisalBoardId) {
    if (
      !mongoose.isValidObjectId(topicId) ||
      !mongoose.isValidObjectId(appraisalBoardId)
    ) {
      return NextResponse.json(
        { message: "Không đúng định dạng ObjectId!" },
        { status: 200 }
      );
    }
    const appraise = await AppraiseGrade.findOne({
      $and: [{ topicId: topicId }, { appraisalBoardId: appraisalBoardId }],
    });
    return NextResponse.json(appraise, { status: 200 });
  }

  // Get all
  return NextResponse.json(await AppraiseGrade.find(), { status: 200 });
}

export async function POST(request) {
  await mongooseConnect();
  const { topicId, appraisalBoardId, criteria, grade, isEureka, note } =
    await request.json();

  // Kiểm tra Object Id
  if (
    !mongoose.isValidObjectId(topicId) ||
    !mongoose.isValidObjectId(appraisalBoardId)
  ) {
    return NextResponse.json(
      { message: "Sai định dạng Object Id!" },
      { status: 200 }
    );
  }

  // Kiểm tra xem có phải update không
  const isUpdate = await AppraiseGrade.find({
    $and: [{ topicId: topicId }, { appraisalBoardId: appraisalBoardId }],
  });

  if (isUpdate.length === 1) {
    await AppraiseGrade.updateOne(
      {
        $and: [{ topicId: topicId }, { appraisalBoardId: appraisalBoardId }],
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

  await AppraiseGrade.create({
    topicId,
    appraisalBoardId,
    criteria,
    grade,
    isEureka,
    note,
  });

  // Kiểm tra lần đánh giá này có phải là đánh giá đầu tiên hay không
  const { isAppraised } = await Topic.findOne(
    { _id: topicId },
    { isAppraised: 1 }
  );
  const { _id: appraiseId } = await AppraiseGrade.findOne(
    {
      $and: [{ topicId: topicId }, { appraisalBoardId: appraisalBoardId }],
    },
    { _id: 1 }
  );
  // Trường hợp 1 - Chưa tồn tại thẩm định nào
  if (!isAppraised) {
    await Topic.updateOne({ _id: topicId }, { $set: { isAppraised: true } });
    await Topic.updateOne(
      { _id: topicId },
      { $push: { appraises: appraiseId } }
    );
    return NextResponse.json(
      { message: "Đã thẩm định lần đầu tiên thành công!" },
      { status: 200 }
    );
  }

  // Trường hợp 2 - Đã tồn tại 1 thẩm định
  if (isAppraised) {
    await Topic.updateOne(
      { _id: topicId },
      { $push: { appraises: appraiseId } }
    );
    return NextResponse.json(
      { message: "Đã thẩm định thành công!" },
      { status: 200 }
    );
  }

  return NextResponse.json({ message: "Có gì đó sai sai..." }, { status: 200 });
}

export async function DELETE(request) {
  await mongooseConnect();
  const topicId = request.nextUrl.searchParams.get("topicId");
  const appraisalBoardId = request.nextUrl.searchParams.get("appraisalBoardId");

  if (
    !mongoose.isValidObjectId(topicId) ||
    !mongoose.isValidObjectId(appraisalBoardId)
  ) {
    return NextResponse.json(
      { message: "Sai định dạng Object Id!" },
      { status: 200 }
    );
  }

  if (
    !(await AppraiseGrade.findOne(
      {
        $and: [{ topicId: topicId }, { appraisalBoardId: appraisalBoardId }],
      },
      { _id: 1 }
    ))
  ) {
    return NextResponse.json(
      { message: "Chưa thẩm định đề tài này!" },
      { status: 409 }
    );
  }

  const { _id: appraiseId } = await AppraiseGrade.findOne(
    {
      $and: [{ topicId: topicId }, { appraisalBoardId: appraisalBoardId }],
    },
    { _id: 1 }
  );

  await AppraiseGrade.findByIdAndDelete(appraiseId);
  await Topic.updateOne({ _id: topicId }, { $pull: { reviews: appraiseId } });
  const topic = await Topic.findOne({ _id: topicId });
  if (topic.reviews.length === 0) {
    await Topic.updateOne({ _id: topicId }, { $set: { isReviewed: false } });
  }

  return NextResponse.json({ message: "Đã xóa thành công!" }, { status: 200 });
}
