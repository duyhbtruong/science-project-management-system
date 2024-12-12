import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { TechnologyScience } from "@/models/users/TechnologyScience";

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
          { technologyScienceId: { $regex: searchKeywords, $options: "i" } },
        ],
      };
    }

    const technologySciences = await TechnologyScience.aggregate([
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

    return NextResponse.json(technologySciences, { status: 200 });
  } catch (error) {
    return new NextResponse("Lỗi lấy danh sách tài khoản phòng KHCN " + error, {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    await mongooseConnect();
    const { technologyScienceId, name, email, phone, password, role } =
      await request.json();

    if (await Account.findOne({ email })) {
      return NextResponse.json(
        { message: "Email đã được sử dụng!" },
        { status: 409 }
      );
    }

    if (await TechnologyScience.findOne({ technologyScienceId })) {
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
    await TechnologyScience.create({
      technologyScienceId,
      accountId: createdAccountId,
    });

    return NextResponse.json(
      { message: "Tài khoản phòng Khoa học Công nghệ đã được tạo thành công!" },
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(
      "Lỗi tạo tài khoản phòng Khoa học Công nghệ " + error,
      { status: 500 }
    );
  }
}
