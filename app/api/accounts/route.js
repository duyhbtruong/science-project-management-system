import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(request) {
  await mongooseConnect();
  return NextResponse.json(await Account.find());
}

export async function POST(request) {
  await mongooseConnect();
  const { name, email, phone, password, role } = await request.json();
  if (await Account.findOne({ email })) {
    return NextResponse.json(
      { message: "Email already in use!" },
      { status: 409 }
    );
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    await Account.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
    });
    return NextResponse.json({ message: "Account created!" }, { status: 201 });
  }
}

export async function DELETE(request) {
  await mongooseConnect();
  const id = request.nextUrl.searchParams.get("id");
  await Account.findByIdAndDelete(id);
  return NextResponse.json({ message: "Account deleted!" }, { status: 200 });
}
