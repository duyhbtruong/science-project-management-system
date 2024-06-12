import { mongooseConnect } from "@/lib/mongoose";
import { Account } from "@/models/Account";
import { Student } from "@/models/Student";
import { TechnologyScience } from "@/models/TechnologyScience";
import { Appraise } from "@/models/Appraise";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  await mongooseConnect();
  const { id } = params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ message: "Not ObjectId" }, { status: 200 });
  }

  const account = await Account.findOne({ _id: id });

  if (!account) {
    return NextResponse.json(
      { message: "Account does not exist!" },
      { status: 200 }
    );
  }

  if (account.role === "student") {
    const student = await Student.findOne({ accountId: id });
    return NextResponse.json({ account, student }, { status: 200 });
  }

  if (account.role === "technologyScience") {
    const technologyScience = await TechnologyScience.findOne({
      accountId: id,
    });
    return NextResponse.json({ account, technologyScience }, { status: 200 });
  }

  if (account.role === "appraise") {
    const appraise = await Appraise.findOne({ accountId: id });
    return NextResponse.json({ account, appraise }, { status: 200 });
  }
}

export async function PUT(request, { params }) {
  await mongooseConnect();
  const { id } = params;
  const {
    name: name,
    email: email,
    phone: phone,
    password: password,
  } = await request.json();

  if (await Account.findOne({ email })) {
    return NextResponse.json(
      { message: "Email already in use!" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const role = await Account.findOne({ _id: id }, { role: 1 });
  if (role === "student") {
    const { studentId, faculty, educationProgram } = await request.json();
    if (await Student.findOne({ studentId })) {
      return NextResponse.json(
        { message: "Student ID already exists!" },
        { status: 409 }
      );
    }

    const sId = await Student.findOne({ accountId: id }, { _id: 1 });
    await Student.findByIdAndUpdate(sId, {
      studentId,
      faculty,
      educationProgram,
    });
    await Account.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      password: hashedPassword,
    });
  }

  if (role === "technologyScience") {
    const { technologyScienceId } = await request.json();
    if (await TechnologyScience.findOne({ technologyScienceId })) {
      return NextResponse.json(
        { message: "Technology Science ID already exists!" },
        { status: 409 }
      );
    }

    const tsId = await TechnologyScience.findOne({ accountId: id }, { _id: 1 });
    await Training.findByIdAndUpdate(tsId, {
      technologyScienceId,
    });
    await Account.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      password: hashedPassword,
    });
  }

  if (role === "appraise") {
    const { appraiseId } = await request.json();
    if (await Appraise.findOne({ appraiseId })) {
      return NextResponse.json(
        { message: "Appraise ID already exists!" },
        { status: 409 }
      );
    }

    const aId = await Appraise.findOne({ accountId: id }, { _id: 1 });
    await Appraise.findByIdAndUpdate(aId, {
      appraiseId,
    });
    await Account.findByIdAndUpdate(id, {
      name,
      email,
      phone,
      password: hashedPassword,
    });
  }

  return NextResponse.json({ message: "Account updated!" }, { status: 200 });
}
