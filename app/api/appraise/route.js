import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { Appraise } from "@/models/Appraise";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request) {
  await mongooseConnect();
  const { appraiseId, name, email, phone, password, role } =
    await request.json();

  if (await Account.findOne({ email })) {
    return NextResponse.json(
      { message: "Email already in use!" },
      { status: 409 }
    );
  }

  if (await Appraise.findOne({ appraiseId })) {
    return NextResponse.json(
      { message: "Appraise ID already exists!" },
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
  await Appraise.create({
    appraiseId,
    accountId: createdAccountId,
  });

  return NextResponse.json(
    { message: "Appraisal department account created!" },
    { status: 201 }
  );
}
