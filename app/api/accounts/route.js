import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { Student } from "@/models/users/Student";
import { AppraisalBoard } from "@/models/users/AppraisalBoard";
import { TechnologyScience } from "@/models/users/TechnologyScience";
import { NextResponse } from "next/server";
import { Instructor } from "@/models/users/Instructor";

export async function GET(request) {
  try {
    await mongooseConnect();

    const searchParams = request.nextUrl.searchParams;
    const searchKeywords = searchParams.get("search");

    const filter = {};

    if (searchKeywords) {
      filter.name = { $regex: searchKeywords, $options: "i" };
    }

    const accounts = await Account.find(filter);

    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    return new NextResponse("Lỗi lấy tài khoản " + error.message, {
      status: 500,
    });
  }
}
