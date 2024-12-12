import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { Student } from "@/models/users/Student";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(request, { params }) {
  try {
    await mongooseConnect();
    const id = params.student;

    if (!id) {
      return new NextResponse("Thiếu id của tài khoản sinh viên.", {
        status: 400,
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return new NextResponse("Id của tài khoản sinh viên không hợp lệ.", {
        status: 400,
      });
    }

    const student = await Student.findOne({ _id: id }).populate("accountId");

    if (!student) {
      return NextResponse.json("Không tìm thấy tài khoản sinh viên.", {
        status: 404,
      });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    return new NextResponse("Lỗi lấy tài khoản sinh viên " + error, {
      status: 500,
    });
  }
}

export async function PUT(request, { params }) {
  try {
    const id = params.student;
    const {
      studentId,
      faculty,
      educationProgram,
      name,
      email,
      phone,
      password,
    } = await request.json();
    const studentUpdate = { faculty, educationProgram };
    const accountUpdate = { name, phone };

    if (!id || !mongoose.isValidObjectId(id)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    await mongooseConnect();

    const student = await Student.aggregate([
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

    if (!student) {
      return new NextResponse("Không tìm thấy tài khoản sinh viên.", {
        status: 404,
      });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      accountUpdate.password = hashedPassword;
    }

    if (studentId !== student.studentId) {
      if (await Student.findOne({ studentId })) {
        return NextResponse.json(
          { message: "Mã số sinh viên đã tồn tại." },
          { status: 409 }
        );
      }

      studentUpdate.studentId = studentId;
    }

    if (email !== student.account.email) {
      if (await Account.findOne({ email })) {
        return NextResponse.json(
          { message: "Email đã được sử dụng." },
          { status: 409 }
        );
      }

      accountUpdate.email = email;
    }

    await Student.findByIdAndUpdate({ _id: id }, studentUpdate);
    await Account.findByIdAndUpdate({ _id: student.accountId }, accountUpdate);

    return NextResponse.json(
      { message: "Tài khoản sinh viên đã cập nhật thành công." },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Lỗi cập nhật tài khoản sinh viên " + error, {
      status: 500,
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.student;

    if (!id || !mongoose.isValidObjectId(id)) {
      return new NextResponse("Thiếu id hoặc id không hợp lệ.", {
        status: 400,
      });
    }

    await mongooseConnect();

    const student = await Student.findOne({ _id: id });

    if (!student) {
      return new NextResponse("Không tìm thấy sinh viên.", { status: 404 });
    }

    const account = await Account.findOne({ _id: student.accountId });

    if (!account) {
      return new NextResponse("Không tìm thấy tài khoản của sinh viên.", {
        status: 404,
      });
    }

    await Student.findByIdAndDelete({ _id: id });
    await Account.findByIdAndDelete({ _id: account._id });

    return NextResponse.json(
      { message: "Xóa tài khoản sinh viên thành công." },
      { status: 200 }
    );
  } catch (error) {
    return new NextResponse("Lỗi xóa tài khoản sinh viên " + error, {
      status: 500,
    });
  }
}
