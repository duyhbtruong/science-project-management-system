import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { Instructor } from "@/models/Instructor";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request) {
  await mongooseConnect();
  const {
    instructorId,
    faculty,
    academicRank,
    name,
    email,
    phone,
    password,
    role,
  } = await request.json();

  if (await Account.findOne({ email })) {
    return NextResponse.json(
      { message: "Email already exists!" },
      { status: 409 }
    );
  }

  if (await Instructor.findOne({ instructorId })) {
    return NextResponse.json(
      { message: "Instructor ID already exists!" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await Account.create({
    name,
    email,
    phone,
    password: hashedPassword,
    role,
  });

  const createdAccountId = await Account.findOne({ email: email }, { _id: 1 });
  await Instructor.create({
    instructorId,
    faculty,
    academicRank,
    accountId: createdAccountId,
  });

  return NextResponse.json(
    { message: "Instructor account created!" },
    { status: 201 }
  );
}
