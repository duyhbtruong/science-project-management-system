import { mongooseConnect } from "@/lib/mongoose";
import { AppraiseGrade } from "@/models/AppraiseGrade";
import { Topic } from "@/models/Topic";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { isWithinAppraisalPeriod } from "@/utils/validator";

export async function GET(request, { params }) {
  try {
    const appraiseId = params.appraiseId;

    if (!appraiseId || !mongoose.isValidObjectId(appraiseId)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const appraise = await AppraiseGrade.findOne({ _id: appraiseId }).populate({
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
          select:
            "title startDate endDate reviewDeadline submitDeadline appraiseDeadline",
        },
      ],
    });

    if (!appraise) {
      return NextResponse.json(
        { message: "Không tìm thấy kết quả thẩm định." },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(appraise, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi lấy thông tin thẩm định " + error },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const appraiseId = params.appraiseId;
    const { criteria, finalGrade, isEureka, comment } = await request.json();

    if (!appraiseId || !mongoose.isValidObjectId(appraiseId)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const appraise = await AppraiseGrade.findOne({ _id: appraiseId }).populate({
      path: "topicId",
      populate: {
        path: "registrationPeriod",
        select: "submitDeadline appraiseDeadline",
      },
    });

    if (!appraise) {
      return NextResponse.json(
        { message: "Không tìm thấy kết quả thẩm định." },
        {
          status: 404,
        }
      );
    }

    if (!isWithinAppraisalPeriod(appraise.topicId.registrationPeriod)) {
      return NextResponse.json(
        {
          message:
            "Không trong thời gian thẩm định. Chỉ có thể thẩm định đề tài trong khoảng thời gian từ ngày kết thúc nộp báo cáo đến hạn thẩm định.",
        },
        { status: 403 }
      );
    }

    appraise.criteria = criteria;
    appraise.finalGrade = finalGrade;
    appraise.isEureka = isEureka;
    appraise.comment = comment;
    appraise.submittedDate = new Date();
    appraise.status = "completed";
    await appraise.save();

    await Topic.updateOne(
      { "appraiseAssignments.appraiseGrade": appraiseId },
      {
        $set: {
          "appraiseAssignments.$[elem].status": "completed",
        },
      },
      {
        arrayFilters: [{ "elem.appraiseGrade": appraiseId }],
      }
    );

    return NextResponse.json(
      { message: "Cập nhật kết quả thẩm định thành công." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi cập nhật kết quả thẩm định " + error },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const appraiseId = params.appraiseId;

    if (!appraiseId || !mongoose.isValidObjectId(appraiseId)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const appraise = await AppraiseGrade.findOne({ _id: appraiseId }).populate({
      path: "topicId",
      populate: {
        path: "registrationPeriod",
        select: "submitDeadline appraiseDeadline",
      },
    });

    if (!appraise) {
      return NextResponse.json(
        { message: "Không tìm thấy kết quả thẩm định." },
        {
          status: 404,
        }
      );
    }

    if (!isWithinAppraisalPeriod(appraise.topicId.registrationPeriod)) {
      return NextResponse.json(
        {
          message:
            "Không trong thời gian thẩm định. Chỉ có thể hủy thẩm định đề tài trong khoảng thời gian từ ngày kết thúc nộp báo cáo đến hạn thẩm định.",
        },
        { status: 403 }
      );
    }

    await AppraiseGrade.findByIdAndDelete(appraiseId);

    if (appraise.status !== "cancelled") {
      const newAppraiseGrade = new AppraiseGrade({
        topicId: appraise.topicId,
        appraisalBoardId: appraise.appraisalBoardId,
        status: "pending",
      });

      await Topic.findByIdAndUpdate(
        appraise.topicId,
        {
          $set: {
            "appraiseAssignments.$[elem].appraiseGrade": newAppraiseGrade._id,
            "appraiseAssignments.$[elem].status": "pending",
          },
        },
        {
          arrayFilters: [{ "elem.appraiseGrade": appraiseId }],
        }
      );

      await newAppraiseGrade.save();
    }

    return NextResponse.json(
      { message: "Xóa kết quả thẩm định thành công và tạo thẩm định mới." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi xóa kết quả thẩm định " + error },
      { status: 500 }
    );
  }
}
