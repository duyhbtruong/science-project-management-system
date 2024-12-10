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

export async function DELETE(request) {
  await mongooseConnect();
  const id = request.nextUrl.searchParams.get("id");
  const { role } = await Account.findOne({ _id: id }, { _id: 0, role: 1 });

  if (role === "student") {
    const studentId = await Student.findOne({ accountId: id }, { _id: 1 });
    await Account.findByIdAndDelete(id);
    await Student.findByIdAndDelete(studentId);
  }

  if (role === "instructor") {
    const instructorId = await Instructor.findOne(
      { accountId: id },
      { _id: 1 }
    );
    await Account.findByIdAndDelete(id);
    await Instructor.findByIdAndDelete(instructorId);
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
    const appraisalBoardId = await AppraisalBoard.findOne(
      { accountId: id },
      { _id: 1 }
    );
    await Account.findByIdAndDelete(id);
    await AppraisalBoard.findByIdAndDelete(appraisalBoardId);
  }

  return NextResponse.json(
    { message: "Tài khoản đã được xóa!" },
    { status: 200 }
  );
}
