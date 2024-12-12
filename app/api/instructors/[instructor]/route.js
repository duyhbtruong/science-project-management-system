import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { Instructor } from "@/models/users/Instructor";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  try {
    const id = params.instructor;

    if (!id || !mongoose.isValidObjectId(id)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    await mongooseConnect();

    const instructor = await Instructor.findOne({ _id: id }).populate(
      "accountId"
    );

    if (!instructor) {
      return new NextResponse("Không tìm thấy tài khoản giảng viên.", {
        status: 404,
      });
    }

    return NextResponse.json(instructor, { status: 200 });
  } catch (error) {
    return new NextResponse("Lỗi lấy tài khoản giảng viên " + error, {
      status: 500,
    });
  }
}

export async function PUT(request, { params }) {
  try {
    const id = params.instructor;
    const {
      instructorId,
      faculty,
      academicRank,
      name,
      email,
      phone,
      password,
    } = await request.json();
    const instructorUpdate = { faculty, academicRank };
    const accountUpdate = { name, phone };

    if (!id || !mongoose.isValidObjectId(id)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    const instructor = await Instructor.aggregate([
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

    if (!instructor) {
      return new NextResponse("Không tìm thấy tài khoản giảng viên.", {
        status: 404,
      });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      accountUpdate.password = hashedPassword;
    }

    if (instructorId !== instructor.instructorId) {
      if (await Instructor.findOne({ instructorId })) {
        return NextResponse.json(
          { message: "Mã số giảng viên đã tồn tại." },
          { status: 409 }
        );
      }

      instructorUpdate.instructorId = instructorId;
    }

    if (email !== instructor.account.email) {
      if (await Account.findOne({ email })) {
        return NextResponse.json(
          { message: "Email đã được sử dụng." },
          { status: 409 }
        );
      }

      accountUpdate.email = email;
    }

    await Instructor.findByIdAndUpdate({ _id: id }, instructorUpdate);
    await Account.findByIdAndUpdate(
      { _id: instructor.accountId },
      accountUpdate
    );

    return NextResponse.json(
      { message: "Tài khoản giảng viên đã cập nhật thành công." },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Lỗi cập nhật tài khoản giảng viên " + error, {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.instructor;

    if (!id || !mongoose.isValidObjectId(id)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    await mongooseConnect();

    const instructor = await Instructor.findOne({ _id: id });

    if (!instructor) {
      return new NextResponse("Không tìm thấy giảng viên.", { status: 404 });
    }

    const account = await Account.findOne({ _id: instructor.accountId });

    if (!account) {
      return new NextResponse("Không tìm thấy tài khoản giảng viên.", {
        status: 404,
      });
    }

    await Instructor.findByIdAndDelete({ _id: id });
    await Account.findByIdAndDelete({ _id: account._id });

    return NextResponse.json(
      { message: "Xóa tài khoản giảng viên thành công." },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Lỗi xóa tài khoản giảng viên " + error, {
      status: 500,
    });
  }
}
