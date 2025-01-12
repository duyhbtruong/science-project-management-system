import { mongooseConnect } from "@/lib/mongoose";
import { Topic } from "@/models/Topic";
import { Account } from "@/models/users/Account";
import { Instructor } from "@/models/users/Instructor";
import { AppraisalBoard } from "@/models/users/AppraisalBoard";
import { ReviewGrade } from "@/models/ReviewGrade";
import { AppraiseGrade } from "@/models/AppraiseGrade";
import { Student } from "@/models/users/Student";
import { RegistrationPeriod } from "@/models/RegistrationPeriod";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    const id = params.topic;

    if (!id || !mongoose.isValidObjectId(id)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    await mongooseConnect();

    const topic = await Topic.findOne({ _id: id })
      .populate({
        path: "instructor",
        populate: {
          path: "accountId",
          select: "name email phone role",
        },
      })
      .populate({
        path: "owner",
        populate: {
          path: "accountId",
          select: "name email phone role",
        },
      })
      .populate({
        path: "registrationPeriod",
      })
      .populate({
        path: "reviewInstructor",
        populate: {
          path: "accountId",
          select: "name email phone role",
        },
      })
      .populate({
        path: "appraiseStaff",
        populate: {
          path: "accountId",
          select: "name email phone role",
        },
      });

    if (!topic) {
      return new NextResponse("Không tìm thấy đề tài.", { status: 404 });
    }

    return NextResponse.json(topic, { status: 200 });
  } catch (error) {
    return new NextResponse("Lỗi lấy thông tin đề tài " + error, {
      status: 500,
    });
  }
}

export async function PUT(request, { params }) {
  try {
    const id = params.topic;
    const {
      vietnameseName,
      englishName,
      type,
      summary,
      reference,
      expectedResult,
      participants,
    } = await request.json();
    const searchParams = request.nextUrl.searchParams;
    const reviewInstructor = searchParams.get("review");
    const appraiseStaff = searchParams.get("appraise");

    if (!id || !mongoose.isValidObjectId(id)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    await mongooseConnect();

    const topic = await Topic.findOne({ _id: id }).populate({
      path: "registrationPeriod",
      select: "reviewDeadline",
    });

    if (!topic) {
      return new NextResponse("Không tìm thấy đề tài.", { status: 404 });
    }

    const updatedTopic = {
      vietnameseName,
      englishName,
      type,
      summary,
      reference,
      expectedResult,
      participants,
    };

    if (reviewInstructor) {
      if (reviewInstructor === "Không có") {
        updatedTopic.reviewInstructor = null;
      } else if (!mongoose.isValidObjectId(reviewInstructor)) {
        return new NextResponse("Id giảng viên kiểm duyệt không hợp lệ.", {
          status: 400,
        });
      } else {
        const instructor = await Instructor.findOne({ _id: reviewInstructor });
        if (!instructor) {
          return new NextResponse("Không tìm thấy giảng viên kiểm duyệt.", {
            status: 404,
          });
        }
        updatedTopic.reviewInstructor = reviewInstructor;
      }
    }

    if (appraiseStaff) {
      if (appraiseStaff === "Không có") {
        updatedTopic.appraiseStaff = null;
      } else if (!mongoose.isValidObjectId(appraiseStaff)) {
        return new NextResponse("Id cán bộ thẩm định không hợp lệ.", {
          status: 400,
        });
      } else {
        const appraisalBoard = await AppraisalBoard.findOne({
          _id: appraiseStaff,
        });
        if (!appraisalBoard) {
          return new NextResponse("Không tìm thấy cán bộ thẩm định.", {
            status: 404,
          });
        }
        updatedTopic.appraiseStaff = appraiseStaff;
      }
    }

    await Topic.findByIdAndUpdate({ _id: id }, updatedTopic);

    return NextResponse.json(
      { message: "Cập nhật thông tin đề tài thành công." },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Lỗi cập nhật thông tin đề tài " + error, {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.topic;

    if (!id || !mongoose.isValidObjectId(id)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    await mongooseConnect();

    const topic = await Topic.findOne({ _id: id }).populate({
      path: "registrationPeriod",
      select: "endDate",
    });

    if (!topic) {
      return new NextResponse("Không tìm thấy đề tài.", { status: 404 });
    }

    const today = new Date();
    if (today > topic.registrationPeriod.endDate) {
      return new NextResponse("Đã hết hạn hủy đăng ký đề tài.", {
        status: 400,
      });
    }

    await Topic.findByIdAndDelete({ _id: id });

    return NextResponse.json(
      { message: "Hủy đăng ký đề tài thành công." },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Lỗi hủy đăng ký đề tài " + error, {
      status: 500,
    });
  }
}
