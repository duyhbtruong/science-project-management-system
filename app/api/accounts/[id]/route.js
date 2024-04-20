import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function GET(request, { params }) {
  await mongooseConnect();
  const { id } = params;
  const account = await Account.findOne({ _id: id });
  return NextResponse.json({ account }, { status: 200 });
}

export async function PUT(request, { params }) {
  await mongooseConnect();
  const { id } = params;
  const {
    name: name,
    email: email,
    phone: phone,
    password: password,
    role: role,
  } = await request.json();
  await Account.findByIdAndUpdate(id, { name, email, phone, password, role });
  return NextResponse.json({ message: "Account updated!" }, { status: 200 });
}
