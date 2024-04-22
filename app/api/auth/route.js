import { auth } from "@/auth";
import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { NextResponse } from "next/server";

export async function GET(request) {
  await mongooseConnect();
  const email = request.nextUrl.searchParams.get("email");
  const id = request.nextUrl.searchParams.get("id");

  if (email) {
    const account = await Account.findOne({ email });
    if (account) {
      return NextResponse.json(
        { account },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        { message: "Account doesn't exist!" },
        { status: 400 }
      );
    }
  }

  if (id) {
    const account = await Account.findOne({ _id: id });
    if (account) {
      return NextResponse.json(
        { account },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        { message: "Account doesn't exist!" },
        { status: 400 }
      );
    }
  }
}
