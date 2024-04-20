import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { message } from "antd";
import { NextResponse } from "next/server";

export async function GET(request) {
  await mongooseConnect();
  const { email } = await request.json();
  if (email) {
    const account = await Account.findOne({ email: email });
    return NextResponse.json(
      { account },
      {
        status: 200,
      }
    );
  } else {
    return NextResponse.json({ message: "Wrong email!" }, { status: 400 });
  }
}
