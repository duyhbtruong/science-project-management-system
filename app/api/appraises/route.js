import { mongooseConnect } from "@/lib/mongoose";
import { AppraiseGrade } from "@/models/AppraiseGrade";
import { Topic } from "@/models/Topic";
import { AppraisalBoard } from "@/models/users/AppraisalBoard";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const periodId = searchParams.get("periodId");
    const appraisalBoardId = searchParams.get("appraisalBoardId");
    const filter = {};

    await mongooseConnect();

    let topicIds = [];
    if (periodId) {
      const topics = await Topic.find({ registrationPeriodId: periodId });
      topicIds = topics.map((topic) => topic._id);
    }

    if (appraisalBoardId) {
      filter.appraisalBoardId = appraisalBoardId;
    }
    if (topicIds.length > 0) {
      filter.topicId = { $in: topicIds };
    }

    const appraises = await AppraiseGrade.find(filter)
      .populate({
        path: "topicId",
        select: "vietnameseName englishName registrationPeriodId owner",
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
    const {
      topicId,
      appraisalBoardId,
      criteria,
      finalGrade,
      isEureka,
      comment,
    } = await request.json();

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

    const appraisalBoard = await AppraisalBoard.findOne({
      _id: appraisalBoardId,
    });

    if (!appraisalBoard) {
      return NextResponse.json(
        { message: "Không tìm thấy hội đồng thẩm định." },
        {
          status: 404,
        }
      );
    }

    await AppraiseGrade.create({
      topicId,
      appraisalBoardId,
      criteria,
      finalGrade,
      isEureka,
      comment,
      submittedDate: new Date(),
    });

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
