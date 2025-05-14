import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { TechnologyScience } from "@/models/users/TechnologyScience";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(request, { params }) {
  try {
    const id = params.technologyScienceId;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const technologyScience = await TechnologyScience.findOne({
      _id: id,
    }).populate("accountId");

    if (!technologyScience) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản phòng KHCN." },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(technologyScience, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi lấy tài khoản phòng KHCN " + error },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const id = params.technologyScienceId;
    const { technologyScienceId, name, email, phone, password } =
      await request.json();
    const technologyScienceUpdate = {};
    const accountUpdate = { name, phone };

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const technologyScience = await TechnologyScience.aggregate([
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

    if (!technologyScience) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản phòng KHCN." },
        {
          status: 404,
        }
      );
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      accountUpdate.password = hashedPassword;
    }

    if (technologyScienceId !== technologyScience.technologyScienceId) {
      if (await TechnologyScience.findOne({ technologyScienceId })) {
        return NextResponse.json(
          { message: "Mã số phòng KHCN đã tồn tại." },
          { status: 409 }
        );
      }

      technologyScienceUpdate.technologyScienceId = technologyScienceId;
    }

    if (email !== technologyScience.account.email) {
      if (await Account.findOne({ email })) {
        return NextResponse.json(
          { message: "Email đã được sử dụng." },
          { status: 409 }
        );
      }

      accountUpdate.email = email;
    }

    await TechnologyScience.findByIdAndUpdate(
      { _id: id },
      technologyScienceUpdate
    );
    await Account.findByIdAndUpdate(
      { _id: technologyScience.accountId },
      accountUpdate
    );

    return NextResponse.json(
      { message: "Tài khoản phòng KHCN đã cập nhật thành công." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi cập nhật tài khoản phòng KHCN " + error },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.technologyScienceId;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    const technologyScience = await TechnologyScience.findOne({ _id: id });

    if (!technologyScience) {
      return NextResponse.json(
        { message: "Không tìm thấy phòng KHCN." },
        { status: 404 }
      );
    }

    const account = await Account.findOne({ _id: technologyScience.accountId });

    if (!account) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản phòng KHCN." },
        {
          status: 404,
        }
      );
    }

    await TechnologyScience.findByIdAndDelete({ _id: id });
    await Account.findByIdAndDelete({ _id: account._id });

    return NextResponse.json(
      { message: "Xóa tài khoản phòng KHCN thành công." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi xóa tài khoản phòng KHCN " + error },
      {
        status: 500,
      }
    );
  }
}
