import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { AppraisalBoard } from "@/models/users/AppraisalBoard";
import { Instructor } from "@/models/users/Instructor";
import { Student } from "@/models/users/Student";
import { TechnologyScience } from "@/models/users/TechnologyScience";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const accountId = params.accountId;

    if (!accountId || !mongoose.isValidObjectId(accountId)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    var account = await Account.findOne({ _id: accountId });

    if (!account) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản." },
        { status: 404 }
      );
    }

    if (account.role === "student") {
      const student = await Student.findOne({ accountId: account._id });

      if (!student) {
        return NextResponse.json(
          { message: "Không tìm thấy sinh viên." },
          { status: 404 }
        );
      }

      account = { account, student };
    }

    if (account.role === "instructor") {
      const instructor = await Instructor.findOne({ accountId: account._id });

      if (!instructor) {
        return NextResponse.json(
          { message: "Không tìm thấy giảng viên." },
          { status: 404 }
        );
      }

      account = { account, instructor };
    }

    if (account.role === "appraise") {
      const appraise = await AppraisalBoard.findOne({ accountId: account._id });

      if (!appraise) {
        return NextResponse.json(
          { message: "Không tìm thấy cán bộ thẩm định." },
          {
            status: 404,
          }
        );
      }

      account = { account, appraise };
    }

    if (account.role === "technologyScience") {
      const technologyScience = await TechnologyScience.findOne({
        accountId: account._id,
      });

      if (!technologyScience) {
        return NextResponse.json(
          { message: "Không tìm thấy phòng KHCN." },
          {
            status: 404,
          }
        );
      }

      account = { account, technologyScience };
    }

    return NextResponse.json(account, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi lấy thông tin tài khoản " + error },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const accountId = params.accountId;

    if (!accountId || !mongoose.isValidObjectId(accountId)) {
      return NextResponse.json(
        { message: "Thiếu id hoặc id không hợp lệ." },
        {
          status: 400,
        }
      );
    }

    await mongooseConnect();

    var account = await Account.findOne({ _id: accountId });

    if (!account) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản." },
        { status: 404 }
      );
    }

    if (account.role === "student") {
      await Student.deleteOne({ accountId: accountId });
      await Account.findByIdAndDelete(accountId);
    }

    if (account.role === "instructor") {
      await Instructor.deleteOne({ accountId: accountId });
      await Account.findByIdAndDelete(accountId);
    }

    if (account.role === "technologyScience") {
      await TechnologyScience.deleteOne({ accountId: accountId });
      await Account.findByIdAndDelete(accountId);
    }

    if (account.role === "appraise") {
      await AppraisalBoard.deleteOne({ accountId: accountId });
      await Account.findByIdAndDelete(accountId);
    }

    return NextResponse.json(
      { message: "Xóa tài khoản thành công." },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi xóa tài khoản " + error },
      {
        status: 500,
      }
    );
  }
}
