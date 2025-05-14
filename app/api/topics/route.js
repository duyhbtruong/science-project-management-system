import { mongooseConnect } from "@/lib/mongoose";
import { Topic } from "@/models/Topic";
import { Student } from "@/models/users/Student";
import { Instructor } from "@/models/users/Instructor";
import { RegistrationPeriod } from "@/models/RegistrationPeriod";
import { Section } from "@/models/Section";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const owner = searchParams.get("owner");
    const period = searchParams.get("period");
    const searchKeywords = searchParams.get("search");
    const instructorId = searchParams.get("instructor");
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

    if (owner) {
      if (!mongoose.isValidObjectId(owner)) {
        return NextResponse.json(
          { message: "Id không hợp lệ." },
          { status: 400 }
        );
      }
      filter.owner = owner;
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
        path: "reviewAssignments",
        populate: [
          {
            path: "instructor",
            populate: {
              path: "accountId",
              select: "name email phone role",
            },
          },
          {
            path: "reviewGrade",
          },
        ],
      })
      .populate({
        path: "appraiseAssignments",
        populate: [
          {
            path: "appraisalBoard",
            populate: {
              path: "accountId",
              select: "name email phone role",
            },
          },
          {
            path: "appraiseGrade",
          },
        ],
      })
      .populate("files");

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

    if (await Topic.findOne({ owner: owner, period: period })) {
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

    // Lấy danh sách tiêu chí
    const sections = await Section.find().sort({ order: 1 });

    // Lưu thông tin đăng ký
    const newTopic = await Topic.create({
      vietnameseName,
      englishName,
      type,
      summary,
      reference,
      expectedResult,
      participants,
      registrationPeriod,
      sections,
      owner,
      instructor,
    });

    return NextResponse.json(
      { topicId: newTopic._id, message: "Đăng ký đề tài thành công!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi đăng ký đề tài " + error },
      { status: 500 }
    );
  }
}
