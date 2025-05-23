import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

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
    return NextResponse.json(
      { message: "Lỗi lấy tài khoản " + error.message },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request) {
  try {
    const { name, email, phone, password, role } = await request.json();

    await mongooseConnect();

    if (await Account.findOne({ email })) {
      return NextResponse.json(
        { message: "Email đã được sử dụng!" },
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

    return NextResponse.json(
      { message: "Tài khoản quản trị viên đã được tạo thành công!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi tạo tài khoản admin " + error },
      {
        status: 500,
      }
    );
  }
}
