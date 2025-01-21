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

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchKeywords = searchParams.get("search");
    const instructorId = searchParams.get("instructor");
    const reviewInstructorId = searchParams.get("reviewInstructor");
    const period = searchParams.get("period");
    const filter = {};

    if (searchKeywords) {
      filter.$or = [
        { vietnameseName: { $regex: searchKeywords, $options: "i" } },
        { englishName: { $regex: searchKeywords, $options: "i" } },
      ];
    }

    if (instructorId) {
      if (!mongoose.isValidObjectId(instructorId)) {
        return NextResponse.json(
          { message: "Id không hợp lệ." },
          { status: 400 }
        );
      }
      filter.instructor = instructorId;
    }

    if (reviewInstructorId) {
      if (!mongoose.isValidObjectId(reviewInstructorId)) {
        return NextResponse.json(
          { message: "Id không hợp lệ." },
          { status: 400 }
        );
      }
      filter.reviewInstructor = reviewInstructorId;
    }

    if (period) {
      if (!mongoose.isValidObjectId(period)) {
        return NextResponse.json(
          { message: "Id không hợp lệ." },
          { status: 400 }
        );
      }
      filter.registrationPeriod = period;
    }

    await mongooseConnect();

    const topics = await Topic.find(filter)
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

    return NextResponse.json(topics, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi lấy danh sách đề tài " + error },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const {
      vietnameseName,
      englishName,
      type,
      summary,
      reference,
      expectedResult,
      participants,
      registrationPeriod,
      owner,
      instructor,
    } = await request.json();

    await mongooseConnect();

    // Kiểm tra tính hợp lệ của đợt đăng ký
    if (!registrationPeriod || !mongoose.isValidObjectId(registrationPeriod)) {
      return NextResponse.json(
        { message: "Thiếu id đợt đăng ký hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    const period = await RegistrationPeriod.findOne({
      _id: registrationPeriod,
    });

    if (!period) {
      return NextResponse.json(
        { message: "Không tìm thấy đợt đăng ký." },
        { status: 404 }
      );
    }

    const today = new Date();
    if (today < period.startDate || today > period.endDate) {
      return NextResponse.json(
        {
          message: "Chưa tới thời gian đăng ký hoặc đã hết thời gian đăng ký.",
        },
        { status: 409 }
      );
    }

    // Kiểm tra tính hợp lệ của sinh viên đăng ký
    if (!owner || !mongoose.isValidObjectId(owner)) {
      return NextResponse.json(
        { message: "Thiếu id chủ nhiệm đề tài hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    if (!(await Student.findOne({ _id: owner }))) {
      return NextResponse.json(
        { message: "Không tìm thấy sinh viên." },
        { status: 404 }
      );
    }

    if (await Topic.findOne({ owner: owner })) {
      return NextResponse.json(
        { message: "Sinh viên đã đăng ký đề tài." },
        { status: 409 }
      );
    }

    // Kiểm tra tính hợp lệ của giảng viên hướng dẫn
    if (!instructor || !mongoose.isValidObjectId(instructor)) {
      return NextResponse.json(
        { message: "Thiếu id giảng viên hướng dẫn hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    if (!(await Instructor.findOne({ _id: instructor }))) {
      return NextResponse.json(
        { message: "Không tìm thấy giảng viên hướng dẫn." },
        {
          status: 404,
        }
      );
    }

    // Lưu thông tin đăng ký
    const newTopicId = await Topic.create({
      vietnameseName,
      englishName,
      type,
      summary,
      reference,
      expectedResult,
      participants,
      registrationPeriod,
      owner,
      instructor,
    }).then((result) => result._id);

    await Student.findByIdAndUpdate(
      { _id: owner },
      { $set: { topicId: newTopicId } }
    );

    return NextResponse.json(
      { newTopicId, message: "Đăng ký đề tài thành công!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi đăng ký đề tài " + error },
      { status: 500 }
    );
  }
}
