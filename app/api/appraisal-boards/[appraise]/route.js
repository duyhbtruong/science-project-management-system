import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { AppraisalBoard } from "@/models/users/AppraisalBoard";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    const id = params.appraise;

    if (!id || !mongoose.isValidObjectId(id)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    await mongooseConnect();

    const appraisalBoard = await AppraisalBoard.findOne({ _id: id }).populate(
      "accountId"
    );

    if (!appraisalBoard) {
      return NextResponse.json("Không tìm thấy tài khoản cán bộ.", {
        status: 404,
      });
    }

    return NextResponse.json(appraisalBoard, { status: 200 });
  } catch (error) {
    return new NextResponse(
      "Lỗi lấy tài khoản cán bộ hội đồng thẩm định " + error,
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const id = params.appraise;
    const { appraisalBoardId, name, email, phone, password } =
      await request.json();
    const appraisalBoardUpdate = {};
    const accountUpdate = { name, phone };

    if (!id || !mongoose.isValidObjectId(id)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    await mongooseConnect();

    const appraisalBoard = await AppraisalBoard.aggregate([
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
      {
        $match: {
          _id: mongoose.Types.ObjectId.createFromHexString(id),
        },
      },
    ]).then((result) => result[0]);

    if (!appraisalBoard) {
      return new NextResponse("Không tìm thấy tài khoản cán bộ hội đồng.", {
        status: 404,
      });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      accountUpdate.password = hashedPassword;
    }

    if (appraisalBoardId !== appraisalBoard.appraisalBoardId) {
      if (await AppraisalBoard.findOne({ appraisalBoardId })) {
        return NextResponse.json(
          { message: "Mã số cán bộ hội đồng đã tồn tại." },
          { status: 409 }
        );
      }

      appraisalBoardUpdate.appraisalBoardId = appraisalBoardId;
    }

    if (email !== appraisalBoard.account.email) {
      if (await Account.findOne({ email })) {
        return NextResponse.json(
          { message: "Email đã được sử dụng." },
          { status: 409 }
        );
      }

      accountUpdate.email = email;
    }

    await AppraisalBoard.findByIdAndUpdate({ _id: id }, appraisalBoardUpdate);
    await Account.findByIdAndUpdate(
      { _id: appraisalBoard.accountId },
      accountUpdate
    );

    return NextResponse.json(
      { message: "Tài khoản cán bộ hội đồng đã cập nhật thành công." },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse(
      "Lỗi cập nhật tài khoản cán bộ hội đồng thẩm định " + error,
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.appraise;

    if (!id || !mongoose.isValidObjectId(id)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    await mongooseConnect();

    const appraisalBoard = await AppraisalBoard.findOne({ _id: id });

    if (!appraisalBoard) {
      return new NextResponse("Không tìm thấy cán bộ hội đồng.", {
        status: 404,
      });
    }

    const account = await Account.findOne({ _id: appraisalBoard.accountId });

    if (!account) {
      return new NextResponse("Không tìm thấy tài khoản cán bộ hội đồng.", {
        status: 404,
      });
    }

    await AppraisalBoard.findByIdAndDelete({ _id: id });
    await Account.findByIdAndDelete({ _id: account._id });

    return NextResponse.json(
      { message: "Xóa tài khoản cán bộ hội đồng thành công." },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Lỗi xóa tài khoản cán bộ hội đồng " + error, {
      status: 500,
    });
  }
}
