import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/users/Account";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    console.log("Connecting to MongoDB...");
    await mongooseConnect();
    console.log("MongoDB connected successfully");

    const email = request.nextUrl.searchParams.get("email");
    const id = request.nextUrl.searchParams.get("id");

    console.log("Looking up account with email:", email);

    if (email) {
      const account = await Account.findOne({ email });
      console.log("Account lookup result:", account ? "Found" : "Not found");

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
      console.log(
        "Account lookup by ID result:",
        account ? "Found" : "Not found"
      );

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
  } catch (error) {
    console.error("Error in auth API route:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
