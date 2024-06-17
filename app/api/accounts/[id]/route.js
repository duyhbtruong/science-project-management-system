import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { Student } from "@/models/Student";
import { TechnologyScience } from "@/models/TechnologyScience";
import { AppraisalBoard } from "@/models/AppraisalBoard";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

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
    email: email,
    phone: phone,
    password: password,
  } = await request.json();

  if (await Account.findOne({ email })) {
    return NextResponse.json(
      { message: "Email đã được sử dụng!" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const role = await Account.findOne({ _id: id }, { role: 1 });
  if (role === "student") {
    const { studentId, faculty, educationProgram } = await request.json();
    if (await Student.findOne({ studentId })) {
      return NextResponse.json(
        { message: "Mã số sinh viên đã tồn tại!" },
        { status: 409 }
      );
    }

    const sId = await Student.findOne({ accountId: id }, { _id: 1 });
    await Student.findByIdAndUpdate(sId, {
      studentId,
      faculty,
      educationProgram,
    });
    await Account.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      password: hashedPassword,
    });
  }

  if (role === "technologyScience") {
    const { technologyScienceId } = await request.json();
    if (await TechnologyScience.findOne({ technologyScienceId })) {
      return NextResponse.json(
        { message: "Mã số phòng Khoa học Công nghệ đã tồn tại!" },
        { status: 409 }
      );
    }

    const tsId = await TechnologyScience.findOne({ accountId: id }, { _id: 1 });
    await Training.findByIdAndUpdate(tsId, {
      technologyScienceId,
    });
    await Account.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      password: hashedPassword,
    });
  }

  if (role === "appraise") {
    const { appraisalBoardId } = await request.json();
    if (await AppraisalBoard.findOne({ appraisalBoardId })) {
      return NextResponse.json(
        { message: "Mã số phòng Thẩm định đã tồn tại!" },
        { status: 409 }
      );
    }

    const aId = await AppraisalBoard.findOne({ accountId: id }, { _id: 1 });
    await AppraisalBoard.findByIdAndUpdate(aId, {
      appraisalBoardId,
    });
    await Account.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      password: hashedPassword,
    });
  }

  return NextResponse.json(
    { message: "Tài khoản đã được cập nhật!" },
    { status: 200 }
  );
}
