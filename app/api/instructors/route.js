import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { Instructor } from "@/models/users/Instructor";
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
          { instructorId: { $regex: searchKeywords, $options: "i" } },
        ],
      };
    }

    const instructors = await Instructor.aggregate([
      {
        $lookup: {
          from: Account.collection.name,
          localField: "accountId",
          foreignField: "_id",
          as: "account",
        },
      },
      {
        $unwind: "$account",
      },
      filter,
    ]);

    return NextResponse.json(instructors, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi lấy danh sách tài khoản giảng viên " + error },
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
    return NextResponse.json(
      { message: "Lỗi tạo tài khoản giảng viên " + error },
      {
        status: 500,
      }
    );
  }
}
