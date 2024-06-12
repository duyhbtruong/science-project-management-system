import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { TechnologyScience } from "@/models/TechnologyScience";

export async function POST(request) {
  await mongooseConnect();
  const { technologyScienceId, name, email, phone, password, role } =
    await request.json();

  if (await Account.findOne({ email })) {
    return NextResponse.json(
      { message: "Email already in use!" },
      { status: 409 }
    );
  }

  if (await TechnologyScience.findOne({ technologyScienceId })) {
    return NextResponse.json(
      { message: "Technology ScienceId ID already exists!" },
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
  await TechnologyScience.create({
    technologyScienceId,
    accountId: createdAccountId,
  });

  return NextResponse.json(
    { message: "Technology Science account created!" },
    { status: 201 }
  );
}
