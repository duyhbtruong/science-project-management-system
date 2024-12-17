import { mongooseConnect } from "@/lib/mongoose";
import { RegistrationPeriod } from "@/models/RegistrationPeriod";
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

    const periods = await RegistrationPeriod.find(filter);

    return NextResponse.json(periods, { status: 200 });
  } catch (error) {
    return new NextResponse("Lỗi lấy danh sách đợt đăng ký " + error, {
      status: 500,
    });
  }
}
