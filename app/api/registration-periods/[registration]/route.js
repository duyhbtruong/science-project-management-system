import { mongooseConnect } from "@/lib/mongoose";
import { RegistrationPeriod } from "@/models/RegistrationPeriod";
import { isDateOverlapping } from "@/utils/validator";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const id = params.registration;

    if (!id || !mongoose.isValidObjectId(id)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    await mongooseConnect();

    const period = await RegistrationPeriod.findOne({ _id: id });

    if (!period) {
      return new NextResponse("Không tìm thấy thông tin đợt đăng ký.", {
        status: 404,
      });
    }

    return NextResponse.json(period, { status: 200 });
  } catch (error) {
    return new NextResponse("Lỗi lấy thông tin đợt đăng ký " + error, {
      status: 500,
    });
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
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const review = new Date(reviewDeadline);
    const submit = new Date(submitDeadline);
    const appraise = new Date(appraiseDeadline);

    if (start >= end) {
      return new NextResponse(
        "Ngày mở đăng ký phải trước ngày kết thúc đăng ký.",
        { status: 400 }
      );
    }

    if (end >= review) {
      return new NextResponse(
        "Ngày kết thúc đăng ký phải trước ngày kiểm duyệt đề tài.",
        { status: 400 }
      );
    }

    if (review >= submit) {
      return new NextResponse(
        "Ngày kiểm duyệt đề tài phải trước ngày nộp hồ sơ nghiệm thu.",
        { status: 400 }
      );
    }

    if (submit >= appraise) {
      return new NextResponse(
        "Ngày nộp hồ sơ nghiệm thu phải trước ngày thẩm định đề tài.",
        { status: 400 }
      );
    }

    await mongooseConnect();

    const registrationPeriod = await RegistrationPeriod.findOne({ _id: id });

    if (!registrationPeriod) {
      return new NextResponse("Không tìm thấy thông tin đợt đăng ký.", {
        status: 404,
      });
    }

    const periods = await RegistrationPeriod.find(
      { _id: { $ne: id } },
      { startDate: 1, endDate: 1 }
    );

    const isOverlapping = periods.some((period) => {
      return isDateOverlapping(start, end, period.startDate, period.endDate);
    });

    if (isOverlapping) {
      return new NextResponse(
        "Thời gian đăng ký trùng với các thời gian đăng ký khác.",
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
    return new NextResponse("Lỗi cập nhật thông tin đợt đăng ký " + error, {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.registration;

    if (!id || !mongoose.isValidObjectId(id)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    const today = new Date();

    await mongooseConnect();

    const period = await RegistrationPeriod.findOne({ _id: id });

    if (!period) {
      return new NextResponse("Không tìm thấy thông tin đợt đăng ký.", {
        status: 404,
      });
    }

    if (period.startDate <= today) {
      return new NextResponse(
        "Không thể xóa đợt đăng ký đã bắt đầu hoặc đã kết thúc.",
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
    return new NextResponse("Lỗi xóa thông tin đợt đăng ký " + error, {
      status: 500,
    });
  }
}
