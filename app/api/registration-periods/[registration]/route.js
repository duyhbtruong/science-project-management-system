import { mongooseConnect } from "@/lib/mongoose";
import { RegistrationPeriod } from "@/models/RegistrationPeriod";
import { isDateOverlapping } from "@/utils/validator";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const id = params.registration;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const period = await RegistrationPeriod.findOne({ _id: id });

    if (!period) {
      return NextResponse.json(
        { message: "Không tìm thấy thông tin đợt đăng ký." },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(period, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi lấy thông tin đợt đăng ký " + error },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const id = params.registration;
    const {
      title,
      startDate,
      endDate,
      reviewDeadline,
      submitDeadline,
      appraiseDeadline,
    } = await request.json();

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const review = new Date(reviewDeadline);
    const submit = new Date(submitDeadline);
    const appraise = new Date(appraiseDeadline);

    if (start >= end) {
      return NextResponse.json(
        { message: "Ngày mở đăng ký phải trước ngày kết thúc đăng ký." },
        { status: 400 }
      );
    }

    if (end >= review) {
      return NextResponse.json(
        { message: "Ngày kết thúc đăng ký phải trước ngày kiểm duyệt đề tài." },
        { status: 400 }
      );
    }

    if (review >= submit) {
      return NextResponse.json(
        {
          message:
            "Ngày kiểm duyệt đề tài phải trước ngày nộp hồ sơ nghiệm thu.",
        },
        { status: 400 }
      );
    }

    if (submit >= appraise) {
      return NextResponse.json(
        {
          message:
            "Ngày nộp hồ sơ nghiệm thu phải trước ngày thẩm định đề tài.",
        },
        { status: 400 }
      );
    }

    await mongooseConnect();

    const registrationPeriod = await RegistrationPeriod.findOne({ _id: id });

    if (!registrationPeriod) {
      return NextResponse.json(
        { message: "Không tìm thấy thông tin đợt đăng ký." },
        {
          status: 404,
        }
      );
    }

    const periods = await RegistrationPeriod.find(
      { _id: { $ne: id } },
      { startDate: 1, endDate: 1 }
    );

    const isOverlapping = periods.some((period) => {
      return isDateOverlapping(start, end, period.startDate, period.endDate);
    });

    if (isOverlapping) {
      return NextResponse.json(
        { message: "Thời gian đăng ký trùng với các thời gian đăng ký khác." },
        { status: 409 }
      );
    }

    await RegistrationPeriod.findByIdAndUpdate(
      { _id: id },
      {
        title,
        startDate: start,
        endDate: end,
        reviewDeadline: review,
        submitDeadline: submit,
        appraiseDeadline: appraise,
      }
    );

    return NextResponse.json(
      { message: "Cập nhật thông tin đợt đăng ký thành công." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi cập nhật thông tin đợt đăng ký " + error },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.registration;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    const today = new Date();

    await mongooseConnect();

    const period = await RegistrationPeriod.findOne({ _id: id });

    if (!period) {
      return NextResponse.json(
        { message: "Không tìm thấy thông tin đợt đăng ký." },
        {
          status: 404,
        }
      );
    }

    if (period.startDate <= today) {
      return NextResponse.json(
        { message: "Không thể xóa đợt đăng ký đã bắt đầu hoặc đã kết thúc." },
        {
          status: 409,
        }
      );
    }

    await RegistrationPeriod.findByIdAndDelete({ _id: id });

    return NextResponse.json(
      { message: "Xóa đợt đăng ký thành công." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi xóa thông tin đợt đăng ký " + error },
      {
        status: 500,
      }
    );
  }
}
