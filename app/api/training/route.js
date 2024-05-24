import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { Training } from "@/models/Training";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request) {
  await mongooseConnect();
  const { trainingId, name, email, phone, password, role } =
    await request.json();

  if (await Account.findOne({ email })) {
    return NextResponse.json(
      { message: "Email already in use!" },
      { status: 409 }
    );
  }

  if (await Training.findOne({ trainingId })) {
    return NextResponse.json(
      { message: "Training ID already exists!" },
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
  await Training.create({
    trainingId,
    accountId: createdAccountId,
  });

  return NextResponse.json(
    { message: "Training department account created!" },
    { status: 201 }
  );
}
