import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { PasswordResetToken } from "@/models/users/PasswordResetToken";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    await mongooseConnect();
    const { token, newPassword } = await request.json();

    // Validate the token
    const resetToken = await PasswordResetToken.findOne({
      token,
      expiresAt: { $gt: new Date() }, // Token must not be expired
    });

    if (!resetToken) {
      return NextResponse.json(
        { message: "Token không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }

    // Find the account with the email
    const account = await Account.findOne({ email: resetToken.email });
    if (!account) {
      return NextResponse.json(
        { message: "Không tìm thấy tài khoản" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the account's password
    await Account.updateOne(
      { email: resetToken.email },
      { $set: { password: hashedPassword } }
    );

    // Delete the token to prevent reuse
    await PasswordResetToken.deleteOne({ _id: resetToken._id });

    return NextResponse.json(
      { message: "Đặt lại mật khẩu thành công" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reset password API route:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi nội bộ" },
      { status: 500 }
    );
  }
}
