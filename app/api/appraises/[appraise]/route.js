import { mongooseConnect } from "@/lib/mongoose";
import { AppraiseGrade } from "@/models/AppraiseGrade";
import { Topic } from "@/models/Topic";
import { AppraisalBoard } from "@/models/users/AppraisalBoard";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const appraiseId = params.appraise;

    if (!appraiseId || !mongoose.isValidObjectId(appraiseId)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const appraise = await AppraiseGrade.findOne({ _id: appraiseId });

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
    const appraiseId = params.appraise;
    const { criteria, grade, isEureka, note } = await request.json();

    if (!appraiseId || !mongoose.isValidObjectId(appraiseId)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const appraise = await AppraiseGrade.findOne({ _id: appraiseId });

    if (!appraise) {
      return NextResponse.json(
        { message: "Không tìm thấy kết quả thẩm định." },
        {
          status: 404,
        }
      );
    }

    await AppraiseGrade.findByIdAndUpdate(appraiseId, {
      criteria,
      grade,
      isEureka,
      note,
    });

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
    const appraiseId = params.appraise;

    if (!appraiseId || !mongoose.isValidObjectId(appraiseId)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const appraise = await AppraiseGrade.findOne({ _id: appraiseId });

    if (!appraise) {
      return NextResponse.json(
        { message: "Không tìm thấy kết quả thẩm định." },
        {
          status: 404,
        }
      );
    }

    const topic = await Topic.findOne({
      "appraises.0": mongoose.Types.ObjectId.createFromHexString(appraiseId),
    });

    if (!topic) {
      return NextResponse.json(
        { message: "Không tìm thấy đề tài" },
        { status: 404 }
      );
    }

    await Topic.findByIdAndUpdate({ _id: topic._id }, { appraises: [] });

    await AppraiseGrade.findByIdAndDelete(appraiseId);

    return NextResponse.json(
      { message: "Xóa kết quả thẩm định thành công." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi xóa kết quả thẩm định " },
      { status: 500 }
    );
  }
}
