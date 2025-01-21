import { mongooseConnect } from "@/lib/mongoose";
import { AppraiseGrade } from "@/models/AppraiseGrade";
import { Topic } from "@/models/Topic";
import { AppraisalBoard } from "@/models/users/AppraisalBoard";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const topicId = request.nextUrl.searchParams.get("topicId");

    if (!topicId || !mongoose.isValidObjectId(topicId)) {
      return NextResponse.json(
        { message: "Thiếu topic id hoặc topic id không hợp lệ." },
        { status: 400 }
      );
    }

    await mongooseConnect();

    const topic = Topic.findOne({ _id: topicId });

    if (!topic) {
      return NextResponse.json(
        { message: "Không tìm thấy đề tài." },
        { status: 404 }
      );
    }

    // TODO: Replace find() with findOne()
    const appraises = await AppraiseGrade.findOne({ topicId: topicId })
      .populate({
        path: "topicId",
        select:
          "vietnameseName englishName type summary reference participants expectedResult",
      })
      .populate({
        path: "appraisalBoardId",
        populate: {
          path: "accountId",
          select: "name email phone role",
        },
      });

    return NextResponse.json(appraises, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi lấy danh sách thẩm định " + error },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const { topicId, appraisalBoardId, criteria, grade, isEureka, note } =
      await request.json();

    if (
      !topicId ||
      !mongoose.isValidObjectId(topicId) ||
      !appraisalBoardId ||
      !mongoose.isValidObjectId(appraisalBoardId)
    ) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        { status: 400 }
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

    const appraiseStaff = await AppraisalBoard.findOne({
      _id: appraisalBoardId,
    });

    if (!appraiseStaff) {
      return NextResponse.json(
        { message: "Không tìm thấy cán bộ thẩm định." },
        {
          status: 404,
        }
      );
    }

    if (!appraiseStaff._id.equals(topic.appraiseStaff)) {
      return NextResponse.json(
        { message: "Cán bộ không phải người thẩm định đề tài." },
        {
          status: 409,
        }
      );
    }

    if (topic.appraises.length > 0) {
      return NextResponse.json(
        { message: "Đề tài đã được thẩm định." },
        {
          status: 409,
        }
      );
    }

    const createdAppraise = await AppraiseGrade.create({
      topicId,
      appraisalBoardId,
      criteria,
      grade,
      isEureka,
      note,
    });

    await Topic.findByIdAndUpdate(
      { _id: topicId },
      { appraises: [...topic.appraises, createdAppraise._id] }
    );

    return NextResponse.json(
      { message: "Tạo thẩm định thành công!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi tạo kết quả thẩm định " + error },
      {
        status: 500,
      }
    );
  }
}
