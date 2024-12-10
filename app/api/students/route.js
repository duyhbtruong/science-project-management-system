import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { Student } from "@/models/users/Student";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function GET(request) {
  await mongooseConnect();
  const id = request.nextUrl.searchParams.get("id");
  const studentId = request.nextUrl.searchParams.get("studentId");

  if (id) {
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Sai định dạng ObjectId" },
        { status: 200 }
      );
    }

    const student = await Student.findOne({ accountId: id });
    if (student) {
      return NextResponse.json(student, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Sinh viên không tồn tại!" },
        { status: 200 }
      );
    }
  }

  if (studentId) {
    if (!mongoose.isValidObjectId(studentId)) {
      return NextResponse.json(
        { message: "Sai định dạng ObjectId" },
        { status: 200 }
      );
    }

    const student = await Student.findOne({ _id: studentId });
    if (student) {
      return NextResponse.json(student, { status: 200 });
    } else {
      return NextResponse.json(
        { message: "Sinh viên không tồn tại!" },
        { status: 200 }
      );
    }
  }
}

export async function POST(request) {
  try {
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

    const createdAccountId = await Account.findOne(
      { email: email },
      { _id: 1 }
    );
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
  } catch (error) {
    return new NextResponse("Lỗi tạo tài khoản sinh viên " + error, {
      status: 500,
    });
  }
}
