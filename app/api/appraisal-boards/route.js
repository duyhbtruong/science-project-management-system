import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { AppraisalBoard } from "@/models/users/AppraisalBoard";
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
          { appraisalBoardId: { $regex: searchKeywords, $options: "i" } },
        ],
      };
    }

    const appraisalBoards = await AppraisalBoard.aggregate([
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

    return NextResponse.json(appraisalBoards, { status: 200 });
  } catch (error) {
    return new NextResponse(
      "Lỗi lấy danh sách tài khoản cán bộ hội đồng " + error,
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
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

    const createdAccountId = await Account.findOne(
      { email: email },
      { _id: 1 }
    );
    await AppraisalBoard.create({
      appraisalBoardId,
      accountId: createdAccountId,
    });

    return NextResponse.json(
      { message: "Tài khoản phòng Thẩm định đã được tạo thành công!" },
      { status: 201 }
    );
  } catch (error) {
    return new NextResponse(
      "Lỗi tạo tài khoản cán bộ hội đồng thẩm định " + error,
      { status: 500 }
    );
  }
}
