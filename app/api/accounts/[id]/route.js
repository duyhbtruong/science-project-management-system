import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { Student } from "@/models/users/Student";
import { TechnologyScience } from "@/models/users/TechnologyScience";
import { AppraisalBoard } from "@/models/users/AppraisalBoard";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { Instructor } from "@/models/users/Instructor";

export async function GET(request, { params }) {
  await mongooseConnect();
  const { id } = params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json(
      { message: "Sai định dạng ObjectId!" },
      { status: 200 }
    );
  }

  const account = await Account.findOne({ _id: id });

  if (!account) {
    return NextResponse.json(
      { message: "Tài khoản không tồn tại!" },
      { status: 200 }
    );
  }

  if (account.role === "student") {
    const student = await Student.findOne({ accountId: id });
    return NextResponse.json({ account, student }, { status: 200 });
  }

  if (account.role === "instructor") {
    const instructor = await Instructor.findOne({ accountId: id });
    return NextResponse.json({ account, instructor }, { status: 200 });
  }

  if (account.role === "technologyScience") {
    const technologyScience = await TechnologyScience.findOne({
      accountId: id,
    });
    return NextResponse.json({ account, technologyScience }, { status: 200 });
  }

  if (account.role === "appraise") {
    const appraise = await AppraisalBoard.findOne({ accountId: id });
    return NextResponse.json({ account, appraise }, { status: 200 });
  }
}

export async function PUT(request, { params }) {
  await mongooseConnect();
  const { id } = params;
  const {
    name: name,
    phone: phone,
    password: password,
    faculty: faculty,
    educationProgram: educationProgram,
    academicRank: academicRank,
  } = await request.json();

  // Trường hợp cập nhật mật khẩu
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { role } = await Account.findOne({ _id: id }, { role: 1 });
    if (role === "student") {
      const sId = await Student.findOne({ accountId: id }, { _id: 1 });
      await Student.findByIdAndUpdate(sId, {
        faculty,
        educationProgram,
      });
    }

    if (role === "instructor") {
      const iId = await Instructor.findOne({ accountId: id }, { _id: 1 });
      await Instructor.findByIdAndUpdate(iId, {
        faculty,
        academicRank,
      });
    }

    await Account.findByIdAndUpdate(id, {
      name,
      phone,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "Tài khoản đã được cập nhật!" },
      { status: 200 }
    );
  } else {
    const { role } = await Account.findOne({ _id: id }, { role: 1 });
    if (role === "student") {
      const sId = await Student.findOne({ accountId: id }, { _id: 1 });
      await Student.findByIdAndUpdate(sId, {
        faculty,
        educationProgram,
      });
    }

    if (role === "instructor") {
      const iId = await Instructor.findOne({ accountId: id }, { _id: 1 });
      await Instructor.findByIdAndUpdate(iId, {
        faculty,
        academicRank,
      });
    }

    await Account.findByIdAndUpdate(id, {
      name,
      phone,
    });

    return NextResponse.json(
      { message: "Tài khoản đã được cập nhật!" },
      { status: 200 }
    );
  }
}
