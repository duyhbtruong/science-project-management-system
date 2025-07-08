import { mongooseConnect } from "@/lib/mongoose";
import { Topic } from "@/models/Topic";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    const id = params.topicId;
    const searchParams = request.nextUrl.searchParams;
    const sections = searchParams.get("sections");

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    let query = Topic.findOne({ _id: id });

    if (sections === "true") {
      query = query.select("+sections");
    }

    const topic = await query
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
      .populate({
        path: "files",
        populate: {
          path: "uploadedBy",
          select: "name email role",
        },
      })
      .populate("report");

    if (!topic) {
      return NextResponse.json(
        { message: "Không tìm thấy đề tài." },
        { status: 404 }
      );
    }

    return NextResponse.json(topic, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi lấy thông tin đề tài " + error },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const id = params.topicId;
    const {
      vietnameseName,
      englishName,
      type,
      summary,
      reference,
      expectedResult,
      participants,
      sections,
      reviewInstructorIds,
      appraisalBoardIds,
    } = await request.json();

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const topic = await Topic.findOne({ _id: id }).populate({
      path: "registrationPeriod",
      select: "reviewDeadline endDate submitDeadline",
    });

    if (!topic) {
      return NextResponse.json(
        { message: "Không tìm thấy đề tài." },
        { status: 404 }
      );
    }

    if (reviewInstructorIds) {
      const today = new Date();
      const endDate = new Date(topic.registrationPeriod.endDate);
      const reviewDeadline = new Date(topic.registrationPeriod.reviewDeadline);

      if (today < endDate) {
        return NextResponse.json(
          { message: "Chưa đến thời gian phân công giảng viên phản biện." },
          {
            status: 400,
          }
        );
      }

      if (today > reviewDeadline) {
        return NextResponse.json(
          { message: "Đã hết thời gian phân công giảng viên phản biện." },
          {
            status: 400,
          }
        );
      }
    }

    if (appraisalBoardIds) {
      const today = new Date();
      const submitDeadline = new Date(topic.registrationPeriod.submitDeadline);

      if (today < submitDeadline) {
        return NextResponse.json(
          { message: "Chưa đến thời gian phân công hội đồng chấm điểm." },
          {
            status: 400,
          }
        );
      }
    }

    const updatedTopic = {
      vietnameseName,
      englishName,
      type,
      summary,
      reference,
      expectedResult,
      participants,
      sections,
    };

    if (reviewInstructorIds) {
      for (const reviewInstructorId of reviewInstructorIds) {
        if (!mongoose.isValidObjectId(reviewInstructorId)) {
          return NextResponse.json(
            { message: "Thiếu id hoặc id không hợp lệ." },
            {
              status: 400,
            }
          );
        }
      }
      await topic.updateReviewers(reviewInstructorIds);
    }

    if (appraisalBoardIds) {
      for (const appraisalBoardId of appraisalBoardIds) {
        if (!mongoose.isValidObjectId(appraisalBoardId)) {
          return NextResponse.json(
            { message: "Thiếu id hoặc id không hợp lệ." },
            {
              status: 400,
            }
          );
        }
      }
      await topic.updateAppraisers(appraisalBoardIds);
    }

    await Topic.findByIdAndUpdate({ _id: id }, updatedTopic);

    return NextResponse.json(
      { message: "Cập nhật thông tin đề tài thành công." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi cập nhật thông tin đề tài " + error },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.topicId;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const topic = await Topic.findOne({ _id: id }).populate({
      path: "registrationPeriod",
      select: "endDate",
    });

    if (!topic) {
      return NextResponse.json(
        { message: "Không tìm thấy đề tài." },
        { status: 404 }
      );
    }

    const today = new Date();
    if (today > topic.registrationPeriod.endDate) {
      return NextResponse.json(
        { message: "Đã hết hạn hủy đăng ký đề tài." },
        {
          status: 400,
        }
      );
    }

    await Topic.findByIdAndDelete({ _id: id });

    return NextResponse.json(
      { message: "Hủy đăng ký đề tài thành công." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi hủy đăng ký đề tài " + error },
      {
        status: 500,
      }
    );
  }
}
