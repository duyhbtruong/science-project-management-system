import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { Student } from "@/models/users/Student";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(request) {
  try {
    await mongooseConnect();
    const searchParams = request.nextUrl.searchParams;
    const searchKeywords = searchParams.get("search");
    var filter = { $match: {} };

    if (searchKeywords) {
      filter.$match = {
        $or: [
          { "account.name": { $regex: searchKeywords, $options: "i" } },
          { studentId: { $regex: searchKeywords, $options: "i" } },
        ],
      };
    }

    const students = await Student.aggregate([
      {
        $lookup: {
          from: Account.collection.name,
          localField: "accountId",
          foreignField: "_id",
          as: "account",
        },
      },
      { $unwind: "$account" },
      filter,
    ]);

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi lấy danh sách sinh viên " + error },
      {
        status: 500,
      }
    );
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
    return NextResponse.json(
      { message: "Lỗi tạo tài khoản sinh viên " + error },
      {
        status: 500,
      }
    );
  }
}
