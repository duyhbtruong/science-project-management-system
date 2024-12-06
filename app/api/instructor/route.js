import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Instructor } from "@/models/Instructor";

export async function POST(request) {
  await mongooseConnect();
  const { instructorId, faculty, name, email, phone, password, role } =
    await request.json();

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

  const createdAccountId = await Account.findOne({ email: email }, { _id: 1 });
  await Instructor.create({
    instructorId,
    faculty,
    accountId: createdAccountId,
  });

  return NextResponse.json(
    { message: "Tài khoản Giảng viên đã được tạo thành công!" },
    { status: 201 }
  );
}
