import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { Student } from "@/models/Student";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function GET(request) {
  await mongooseConnect();
  const id = request.nextUrl.searchParams.get("id");

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ message: "Not ObjectId" }, { status: 200 });
  }

  const student = await Student.findOne({ accountId: id });
  if (student) {
    return NextResponse.json(student, { status: 200 });
  } else {
    return NextResponse.json(
      { message: "Student does not exist!" },
      { status: 200 }
    );
  }
}

export async function POST(request) {
  await mongooseConnect();
  const {
    studentId,
    faculty,
    educationProgram,
    name,
    email,
    phone,
    password,
    role,
  } = await request.json();

  if (await Account.findOne({ email })) {
    return NextResponse.json(
      { message: "Email đã được sử dụng!" },
      { status: 409 }
    );
  }

  if (await Student.findOne({ studentId })) {
    return NextResponse.json(
      { message: "Mã số sinh viên đã tồn tại!" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await Account.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role,
  });

  const createdAccountId = await Account.findOne({ email: email }, { _id: 1 });
  await Student.create({
    studentId,
    faculty,
    educationProgram,
    accountId: createdAccountId,
  });

  return NextResponse.json(
    { message: "Tài khoản sinh viên đã được tạo thành công!" },
    { status: 201 }
  );
}
