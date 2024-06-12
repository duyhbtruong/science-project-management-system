import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { Appraise } from "@/models/Appraise";
import { Student } from "@/models/Student";
import { TechnologyScience } from "@/models/TechnologyScience";
import { NextResponse } from "next/server";

export async function GET(request) {
  await mongooseConnect();

  // Trường hợp tìm tài khoản bằng email
  const email = request.nextUrl.searchParams.get("email");
  if (email) {
    const account = await Account.findOne({ email });

    if (!account) {
      return NextResponse.json(
        { message: "Account does not exist!" },
        { status: 200 }
      );
    }

    if (account.role === "student") {
      const student = await Student.findOne({ accountId: account._id });
      return NextResponse.json({ account, student }, { status: 200 });
    }

    if (account.role === "technologyScience") {
      const technologyScience = await TechnologyScience.findOne({
        accountId: account._id,
      });
      return NextResponse.json({ account, technologyScience }, { status: 200 });
    }

    if (account.role === "appraise") {
      const appraise = await Appraise.findOne({ accountId: account._id });
      return NextResponse.json({ account, appraise }, { status: 200 });
    }

    if (account.role === "admin") {
      return NextResponse.json(
        { message: "You are not authorized as admin!" },
        { status: 200 }
      );
    }
  }

  if (email === "") {
    return NextResponse.json(
      { message: "You are not authorized as admin!" },
      { status: 200 }
    );
  }

  // Trường hợp lấy tất cả tài khoản
  return NextResponse.json(await Account.find());
}

export async function DELETE(request) {
  await mongooseConnect();
  const id = request.nextUrl.searchParams.get("id");
  const { role } = await Account.findOne({ _id: id }, { _id: 0, role: 1 });

  if (role === "student") {
    const studentId = await Student.findOne({ accountId: id }, { _id: 1 });
    await Account.findByIdAndDelete(id);
    await Student.findByIdAndDelete(studentId);
  }

  if (role === "technologyScience") {
    const technologyScienceId = await TechnologyScience.findOne(
      {
        accountId: id,
      },
      { _id: 1 }
    );
    await Account.findByIdAndDelete(id);
    await TechnologyScience.findByIdAndDelete(technologyScienceId);
  }

  if (role === "appraise") {
    const appraiseId = await Appraise.findOne({ accountId: id }, { _id: 1 });
    await Account.findByIdAndDelete(id);
    await Appraise.findByIdAndDelete(appraiseId);
  }

  return NextResponse.json({ message: "Account deleted!" }, { status: 200 });
}
