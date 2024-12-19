import { mongooseConnect } from "@/lib/mongoose";
import { RegistrationPeriod } from "@/models/RegistrationPeriod";
import { isDateOverlapping } from "@/utils/validator";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchKeywords = searchParams.get("search");
    const filter = {};

    if (searchKeywords) {
      filter.title = { $regex: searchKeywords, $options: "i" };
    }

    await mongooseConnect();

    const periods = await RegistrationPeriod.find({}, filter);

    return NextResponse.json(periods, { status: 200 });
  } catch (error) {
    return new NextResponse("Lỗi lấy danh sách đợt đăng ký " + error, {
      status: 500,
    });
  }
}

export async function POST(request, { params }) {
  try {
    const {
      title,
      startDate,
      endDate,
      reviewDeadline,
      submitDeadline,
      appraiseDeadline,
    } = await request.json();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const review = new Date(reviewDeadline);
    const submit = new Date(submitDeadline);
    const appraise = new Date(appraiseDeadline);

    if (yesterday > start) {
      return new NextResponse("Ngày mở đăng ký phải từ ngày hôm nay trở đi.", {
        status: 400,
      });
    }

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

    const periods = await RegistrationPeriod.find(
      {},
      { startDate: 1, appraiseDeadline: 1 }
    );

    const isOverlapping = periods.some((period) => {
      return isDateOverlapping(
        start,
        appraise,
        period.startDate,
        period.appraiseDeadline
      );
    });

    if (isOverlapping) {
      return new NextResponse(
        "Thời gian đăng ký trùng với các thời gian đăng ký khác.",
        { status: 409 }
      );
    }

    await RegistrationPeriod.create({
      title,
      startDate: start,
      endDate: end,
      reviewDeadline: review,
      submitDeadline: submit,
      appraiseDeadline: appraise,
    });

    return NextResponse.json(
      { message: "Tạo đợt đăng ký thành công." },
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse("Lỗi tạo đợt đăng ký " + error, { status: 500 });
  }
}
