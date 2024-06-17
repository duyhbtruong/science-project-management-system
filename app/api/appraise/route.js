import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { AppraisalBoard } from "@/models/AppraisalBoard";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request) {
  await mongooseConnect();
  const { appraisalBoardId, name, email, phone, password, role } =
    await request.json();

  if (await Account.findOne({ email })) {
    return NextResponse.json(
      { message: "Email đã được sử dụng!" },
      { status: 409 }
    );
  }

  if (await AppraisalBoard.findOne({ appraisalBoardId })) {
    return NextResponse.json(
      { message: "Mã số phòng Thẩm định đã tồn tại!" },
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
  await AppraisalBoard.create({
    appraisalBoardId,
    accountId: createdAccountId,
  });

  return NextResponse.json(
    { message: "Tài khoản phòng Thẩm định đã được tạo thành công!" },
    { status: 201 }
  );
}
