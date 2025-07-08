import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { PasswordResetToken } from "@/models/users/PasswordResetToken";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    await mongooseConnect();
    const { email } = await request.json();

    // Check if the email exists
    const account = await Account.findOne({ email });
    if (!account) {
      return NextResponse.json(
        {
          message:
            "Nếu tài khoản với email này tồn tại, một liên kết đặt lại mật khẩu đã được gửi.",
        },
        { status: 200 }
      );
    }

    // Generate a random token using UUID
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

    // Save the token to the database
    await PasswordResetToken.findOneAndDelete({ email }); // Delete any existing token
    await PasswordResetToken.create({
      email,
      token,
      expiresAt,
    });

    // Create reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`;

    console.log("Password reset link:", resetLink);

    // Send email with Resend
    if (process.env.NODE_ENV === "production") {
      try {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Đặt lại mật khẩu",
          html: `
            <div>
              <h1>Đặt lại mật khẩu</h1>
              <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
              <p>Vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn:</p>
              <a href="${resetLink}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Đặt lại mật khẩu</a>
              <p>Liên kết này sẽ hết hạn sau 1 giờ.</p>
              <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            </div>
          `,
        });
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }

    return NextResponse.json(
      {
        message:
          "Nếu tài khoản với email này tồn tại, một liên kết đặt lại mật khẩu đã được gửi.",
        // Only include token in development for testing
        ...(process.env.NODE_ENV === "development" && { resetLink, token }),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in forgot password API route:", error);
    return NextResponse.json(
      { message: "Đã xảy ra lỗi nội bộ" },
      { status: 500 }
    );
  }
}
