import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Instructor } from "@/models/users/Instructor";

export async function POST(request) {
  try {
    await mongooseConnect();
    const {
      instructorId,
      faculty,
      academicRank,
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

    if (await Instructor.findOne({ instructorId })) {
      return NextResponse.json(
        { message: "Mã số phòng Khoa học Công nghệ đã tồn tại!" },
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
    await Instructor.create({
      instructorId,
      faculty,
      academicRank,
      accountId: createdAccountId,
    });

    return NextResponse.json(
      { message: "Tài khoản giảng viên đã được tạo thành công!" },
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse("Lỗi tạo tài khoản giảng viên " + error, {
      status: 500,
    });
  }
}
